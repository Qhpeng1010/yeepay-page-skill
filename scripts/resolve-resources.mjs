#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { routeBusiness } from './route-business.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STAGES = new Set(['route', 'requirement', 'design', 'template', 'generate', 'review', 'all']);

function normalize(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function scoreIntent(request, intent) {
  const matches = (intent.signals || []).filter((signal) => request.includes(normalize(signal)));
  const score = matches.reduce((total, signal) => total + normalize(signal).length, 0);
  const firstMatchIndex = matches.length ? Math.min(...matches.map((signal) => request.indexOf(normalize(signal)))) : Number.POSITIVE_INFINITY;
  return { intent, score, matches, firstMatchIndex };
}

function unique(paths) {
  return [...new Set(paths)];
}

function readContract(route) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, route.contract), 'utf8'));
}

function existingMarkdown(paths) {
  const invalid = paths.filter((resource) => path.extname(resource) !== '.md' || !fs.existsSync(path.join(ROOT, resource)));
  if (invalid.length) throw new Error(`Invalid Markdown resources: ${invalid.join(', ')}`);
  return paths;
}

export function resolveResources(rawRequest, stage) {
  if (!STAGES.has(stage)) return { status: 'error', message: `Unsupported stage: ${stage || '<empty>'}` };

  const routed = routeBusiness(rawRequest);
  const route = routed.status === 'routed' ? { ...routed, request: rawRequest } : routed;
  if (route.status !== 'routed') return route;
  if (stage === 'route') return { ...route, resources: existingMarkdown([route.domain]) };

  const selection = selectIntent(route, rawRequest);
  if (selection.status !== 'resolved') return selection;
  if (stage === 'all') return resolveAll(route, selection);

  return resolveStage(route, selection, stage);
}

function selectIntent(route, rawRequest) {
  const contract = readContract(route);
  const request = normalize(rawRequest);
  const ranked = contract.intents
    .map((intent) => scoreIntent(request, intent))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.firstMatchIndex - b.firstMatchIndex);

  if (!ranked.length) {
    return {
      status: 'clarify',
      module: route.module,
      question: `已识别为${route.name}，但还无法确定页面类型，请补充主要页面意图。`,
      candidates: contract.intents.map(({ id, pageType }) => ({ id, pageType }))
    };
  }

  if (ranked[1] && ranked[0].score === ranked[1].score && ranked[0].firstMatchIndex === ranked[1].firstMatchIndex) {
    return {
      status: 'clarify',
      module: route.module,
      question: `需求同时命中 ${ranked[0].intent.pageType} 和 ${ranked[1].intent.pageType}，请确认主要页面类型。`,
      candidates: ranked.slice(0, 3).map(({ intent, matches }) => ({ id: intent.id, matches }))
    };
  }

  return { status: 'resolved', selected: ranked[0].intent, matches: ranked[0].matches };
}

function resolveStage(route, selection, stage) {
  const selected = selection.selected;
  const contract = readContract(route);
  const adapter = contract.adapter;
  if (!adapter?.resources) throw new Error(`${route.module}: domain contract is missing adapter.resources`);

  let resources = [...(adapter.resources[stage] || [])];
  const templateConfig = adapter.template;
  const selectedTemplateId = selected.templateId || selected.template || '';
  let selectedTemplates = [];
  if (templateConfig?.stages?.includes(stage)) {
    selectedTemplates = [
      ...(templateConfig.framework || []),
      selected.template,
      ...(templateConfig.supportingRules || [])
        .filter((rule) => (rule.signals || []).some((signal) => normalize(route.request).includes(normalize(signal))))
        .flatMap((rule) => rule.templates || [])
    ].filter(Boolean);
    resources.push(...selectedTemplates.map((template) => path.posix.join(templateConfig.directory, template)));
  }

  resources = existingMarkdown(unique(resources));
  const commandTemplates = adapter.commands?.[stage] || {};
  const businessTemplates = selectedTemplates.filter((template) => !(templateConfig?.framework || []).includes(template));
  const replacements = {
    '{module}': route.module,
    '{template}': selectedTemplateId,
    '{templates}': selectedTemplates.length ? unique(businessTemplates).join(',') : selectedTemplateId
  };
  const commands = Object.fromEntries(Object.entries(commandTemplates).map(([name, command]) => {
    const resolved = Object.entries(replacements).reduce((value, [token, replacement]) => value.replaceAll(token, replacement), command);
    return [name, resolved.trim()];
  }));

  const execution = resolveExecution(rootPath(route), adapter.execution, selected, selectedTemplateId);
  if (execution && ['template', 'generate', 'review'].includes(stage)) {
    resources.push(...existingMarkdown(execution.resources));
  }

  return {
    status: 'resolved',
    module: route.module,
    intent: selected.id,
    pageType: selected.pageType,
    template: selectedTemplateId || null,
    ruleTemplate: selectedTemplateId || null,
    implementationMode: contract.implementationMode,
    assumption: route.assumption,
    matches: selection.matches,
    resources: unique(resources),
    commands: execution && stage === 'generate'
      ? execution.mode === 'legacy'
        ? {
            preflight: commands.preflight,
            scaffold: execution.legacyScaffoldCommand,
            verify: execution.legacyVerifyCommand
          }
        : {
            prepare: commands.prepare,
            preflight: commands.preflight,
            scaffold: execution.scaffoldCommand,
            build: execution.buildCommand,
            verify: execution.verifyCommand
          }
      : commands,
    execution
  };
}

function rootPath(route) {
  return route;
}

function resolveExecution(_route, executionConfig, selected, templateId) {
  if (!executionConfig) return null;
  const policyPath = path.join(ROOT, executionConfig.policy);
  const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
  if (executionConfig.templateRegistry) {
    const registryPath = path.join(ROOT, executionConfig.templateRegistry);
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    if (!(registry.templates || []).some((template) => template.id === templateId)) {
      throw new Error(`${templateId || '<empty>'}: rule template is missing from ${executionConfig.templateRegistry}`);
    }
  }
  const familyId = selected.executionFamily || selected.id;
  const family = (policy.families || []).find((entry) => entry.id === familyId);
  if (!family) throw new Error(`${familyId}: execution family is missing from ${executionConfig.policy}`);
  const mode = family.intentModes?.[selected.id] || family.mode;
  const replace = (command) => String(command || '')
    .replaceAll('{family}', familyId)
    .replaceAll('{template}', templateId || '');
  return {
    system: policy.system,
    policyVersion: policy.policyVersion,
    family: familyId,
    availability: family.availability,
    mode,
    capabilities: family.capabilities || [],
    ruleRefs: family.ruleRefs || [],
    schema: executionConfig.schema,
    releaseManifest: executionConfig.releaseManifest,
    resources: [executionConfig.coreContext, executionConfig.contextIndex, executionConfig.familyContexts?.[familyId]].filter(Boolean),
    scaffoldCommand: replace(executionConfig.scaffoldCommand),
    buildCommand: replace(executionConfig.buildCommand),
    verifyCommand: replace(executionConfig.verifyCommand),
    legacyScaffoldCommand: mode === 'legacy' ? replace(executionConfig.legacyScaffoldCommand) : undefined,
    legacyVerifyCommand: mode === 'legacy' ? replace(executionConfig.legacyVerifyCommand) : undefined
  };
}

function resolveAll(route, selection) {
  const stages = {};
  ['requirement', 'design', 'template', 'generate', 'review'].forEach((stage) => {
    stages[stage] = resolveStage(route, selection, stage);
  });
  return {
    status: 'resolved',
    route,
    intent: selection.selected.id,
    pageType: selection.selected.pageType,
    template: selection.selected.templateId || selection.selected.template || null,
    stages,
    resources: unique(Object.values(stages).flatMap((stage) => stage.resources)),
    commands: stages.generate.commands
  };
}

function readArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const result = resolveResources(readArg('--request'), readArg('--stage'));
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    process.exitCode = result.status === 'resolved' || (readArg('--stage') === 'route' && result.status === 'routed') ? 0 : 2;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
