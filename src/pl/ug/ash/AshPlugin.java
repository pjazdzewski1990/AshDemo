package pl.ug.ash;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.util.Log;

public class AshPlugin extends CordovaPlugin {

  public static final String  ACTION_ORIENTATION_HORIZONTAL = "orientationHorizontal";       
  public static final String  ACTION_ORIENTATION_VERTICAL = "orientationVertical";
  
  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

    if (ACTION_ORIENTATION_HORIZONTAL.equals(action)) {
      try {
        
          Activity testActivity = this.cordova.getActivity();
          CordovaWebView testView = (CordovaWebView) testActivity.findViewById(android.R.id.content);
          testView.sendJavascript("alert('cuda wianki');");
          testView.sendJavascript("window.orientation = 90;");
          
        Log.d("HelloPlugin", "Changing orientation to horizontal");
        changeOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        
        callbackContext.success("");
        return true;
      }                    
      catch (Exception ex) {
        Log.d("AshPlugin error:", ex.toString());
      }  
    }
    if (ACTION_ORIENTATION_VERTICAL.equals(action)) {
      try {
        Log.d("HelloPlugin", "Changing orientation to vertical");
        changeOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        
        callbackContext.success("");
        return true;
      }                    
      catch (Exception ex) {
        Log.d("AshPlugin error:", ex.toString());
      }  
    }
    
    callbackContext.error("Error");
    return false;
  }

  private void changeOrientation(int orientation) {
    this.cordova.getActivity().setRequestedOrientation(orientation);
  }
}
