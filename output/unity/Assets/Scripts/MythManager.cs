using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// The MythManager coordinates all elements of the myth
/// </summary>
public class MythManager : MonoBehaviour
{
    // References
    public GameObject entityPrefab;
    public GameObject environmentPrefab;
    
    // Quests
    // No quests defined
    
    // UI Elements
    public Text statusText;
    
    // Start is called before the first frame update
    void Start()
    {
        Debug.Log("Myth Manager initialized");
        
        // Initialize environment
        var env = Instantiate(environmentPrefab);
        env.name = "Environment";
        
        // Initialize entity
        var entity = Instantiate(entityPrefab);
        entity.name = "Entity";
        
        // Position the entity
        entity.transform.position = new Vector3(0, 1, 0);
        
        // Initialize quests
        // No quests to initialize
    }

    // Update is called once per frame
    void Update()
    {
        // Check for quest triggers, etc.
    }
    
    // No quest methods defined
}