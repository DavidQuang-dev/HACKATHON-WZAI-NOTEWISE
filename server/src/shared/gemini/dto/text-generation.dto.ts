export class TextGenerationDto {
  prompt: string;
  context: {
    entityContext: string[];
    knowledgeContext: string[];
  };
}
