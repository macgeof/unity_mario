// generate a prefab from the selection

@MenuItem ("Project Tools / Make Prefab %l")

static function CreatePrefab ()
{
	var selectedObjects : GameObject[] = Selection.gameObjects;	// selection from the scene view
	
	// loop through our selection
	for (var go : GameObject in selectedObjects)
	{
		var name : String = go.name;		// store the name of our selection
		var localPath : String = "Assets/" + name + ".prefab";		// create the path for the prefab
		// check for object in project
		if (AssetDatabase.LoadAssetAtPath(localPath, GameObject))
		{
			// check for user choice
			if (EditorUtility.DisplayDialog ("Caution", "Prefab already exists. Do you want to overwrite?", "Yes", "No"))
			{
				createNew (go, localPath);	// creating a new prefab
			}
		}
		else
		{
			createNew (go, localPath);		// creating a new prefab
		}
	}
}
// Create a new prefab
static function createNew ( selectedObject : GameObject, localPath : String)
{
	var prefab : Object = PrefabUtility.CreateEmptyPrefab (localPath);	// store prefab
	PrefabUtility.ReplacePrefab (selectedObject, prefab);						// set prefab to prefab	
	AssetDatabase.Refresh();		// refresh the database
	
	DestroyImmediate (selectedObject);		// Remove the selected object
	var clone : GameObject = PrefabUtility.InstantiatePrefab(prefab) as GameObject;	// replace object with prefab
}


