// Settings
export const MAX_DELAY = 10;
export const MAX_DURATION = 10;
export const MAX_VOLUME = 1;
export const MAX_NOTESET_SIZE = 144;

// Parser
export const S_PARSER_LOADING = "<<";
export const S_PARSER_SAVE = ">>";
export const S_PARSER_DELAY = "d:";
export const S_PARSER_DURATION = "t:";
export const S_PARSER_VOLUME = "v:";
export const S_PARSER_CHORD_CONCAT = "^";
export const S_PARSER_STEP_SUB = "-";
export const S_PARSER_STEP_ADD = "+";
export const S_PARSER_PARAMETER_NEXT = ",";
export enum D_START { S_CHORD = "{", S_OPTIONS = "(" }
export enum D_END { S_CHORD = "}", S_OPTIONS = ")" }

