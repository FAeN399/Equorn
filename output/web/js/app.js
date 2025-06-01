/**
 * Equorn Generated Web Experience
 * Entity: Unknown
 * Environment: Unknown
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Mythic experience initialized');
  
  // Entity interaction setup
  const entityElement = document.getElementById('entity');
  if (entityElement) {
    entityElement.addEventListener('click', function() {
      showEntityDetails();
    });
  }
  
  // No quests defined
  
  function showEntityDetails() {
    const entity = {
  "name": "Unknown Entity",
  "type": "Unknown"
};
    
    alert(`${entity.name}\n\nType: ${entity.type}${entity.description ? '\n\n' + entity.description : ''}`);
  }
});