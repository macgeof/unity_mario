// generate folders in our project
import  System.IO;

@MenuItem ("Project Tools / Make Folders")
// menuItem read the first static function
static function MakeFolder()
{
	GenerateFolders(); 
}

static function GenerateFolders()
{
	var projectPath : String = Application.dataPath + "/";		// store the path for the folders
	
	// creating the folders
	Directory.CreateDirectory(projectPath + "Audio");
	Directory.CreateDirectory(projectPath + "Materials");
	Directory.CreateDirectory(projectPath + "Meshes");
	Directory.CreateDirectory(projectPath + "Fonts");
	Directory.CreateDirectory(projectPath + "Textures");
	Directory.CreateDirectory(projectPath + "Resources");
	Directory.CreateDirectory(projectPath + "Scripts");
	Directory.CreateDirectory(projectPath + "Shaders");
	Directory.CreateDirectory(projectPath + "Packages");
	Directory.CreateDirectory(projectPath + "Physics");
	Directory.CreateDirectory(projectPath + "Scenes");
		
	AssetDatabase.Refresh ();		// refresh the project tab to update with the folders generated
}

