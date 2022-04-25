import { getDataManager } from 'services/DataManager';

export type IStoredRule = {
    rule: string;
    type: RuleType;
};

export type RuleType = 'allow' | 'block';

export interface IValidRule {
    rule: RegExp
}

async function getRules(): Promise<IStoredRule[]> {
    const datamanager = await getDataManager();
    return await datamanager.getValue<IStoredRule[]>('rules') || [];
}

export function isValidRule(value: string): boolean {
    if (value.length === 0) {
        return false;
    }
    try {
        new RegExp(value);
        return true;
    } catch {
        return false;
    }
}

async function RulesByType(type: RuleType): Promise<IValidRule[]> {
    const rules = await getRules();
    return rules
        .filter(rule => rule.type === type)
        .filter(rule => isValidRule(rule.rule))
        .map(r => {
            return {
                rule: new RegExp(r.rule)
            }
        });
}

let cachedBlockRules: IValidRule[] | null = null
export async function BlockRules(): Promise<IValidRule[]> {
    if (cachedBlockRules !== null) {
        return cachedBlockRules;
    }
    return (cachedBlockRules = await RulesByType('block'));
}

let cachedAllowRules: IValidRule[] | null = null
export async function AllowRules(): Promise<IValidRule[]> {
    if (cachedAllowRules !== null) {
        return cachedAllowRules;
    }
    return (cachedAllowRules = await RulesByType('allow'));
}
