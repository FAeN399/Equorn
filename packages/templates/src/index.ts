import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Get a list of all available seed templates
 * @returns Array of template names
 */
export function listTemplates(): string[] {
  const templatesDir = path.join(__dirname, '../seeds');
  try {
    return fs.readdirSync(templatesDir)
      .filter((file: string) => file.endsWith('.yaml') || file.endsWith('.json'))
      .map((file: string) => file.replace(/\.(yaml|json)$/, ''));
  } catch (error) {
    console.error('Error listing templates:', error);
    return [];
  }
}

/**
 * Get the path to a specific template
 * @param templateName Name of the template without extension
 * @returns Full path to the template file
 */
export function getTemplatePath(templateName: string): string | null {
  const templatesDir = path.join(__dirname, '../seeds');
  
  // Try both YAML and JSON extensions
  const yamlPath = path.join(templatesDir, `${templateName}.yaml`);
  const jsonPath = path.join(templatesDir, `${templateName}.json`);
  
  if (fs.existsSync(yamlPath)) {
    return yamlPath;
  } else if (fs.existsSync(jsonPath)) {
    return jsonPath;
  }
  
  return null;
}

/**
 * Template metadata interface
 */
export interface TemplateInfo {
  name: string;
  description: string;
  author: string;
  version: string;
  entityType: string;
}

/**
 * Get basic metadata about all available templates
 * @returns Array of template info objects
 */
export function getTemplatesInfo(): TemplateInfo[] {
  const templates = listTemplates();
  return templates.map(name => {
    // This is a simplified version - in a real implementation,
    // you would parse the YAML/JSON to extract actual metadata
    return {
      name,
      description: `Template for ${name}`,
      author: 'Equorn Team',
      version: '1.0.0',
      entityType: name.includes('guardian') ? 'guardian' : 'unknown'
    };
  });
}

export default {
  listTemplates,
  getTemplatePath,
  getTemplatesInfo
};
