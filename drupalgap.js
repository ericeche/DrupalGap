var drupalgap = {
  'modules':{
	  'core':[
	     {'name':'api'},
	     {'name':'block'},
	     {'name':'comment'},
	     {'name':'dashboard'},
	     {'name':'entity'},
	     {'name':'field'},
	     {'name':'form'},
	     {'name':'menu'},
	     {'name':'node'},
	     {'name':'services',
	       'includes':[
		       {'name':'comment'},
		       {'name':'drupalgap_content'},
		       {'name':'drupalgap_system'},
		       {'name':'drupalgap_taxonomy'},
		       {'name':'drupalgap_user'},
		       {'name':'file'},
		       {'name':'node'},
		       {'name':'services'},
		       {'name':'system'},
		       {'name':'taxonomy_term'},
		       {'name':'taxonomy_vocabulary'},
		       {'name':'user'},
	       ]
	     },
	     {'name':'system'},
	     {'name':'taxonomy'},
	     {'name':'user'},
	     {'name':'views_datasource'},
	   ]
  },
  'module_paths':[],
  'includes':[
      {'name':'common'},
      {'name':'menu'},
      {'name':'module'},
      {'name':'theme'},
  ],
  'user':{
	  'uid':0, /* do not change this user id value */
	  'name':'Anonymous', /* TODO - this value should come from the drupal site */
  },
  'online':false,
  'destination':'',
  'account':{ }, /* <!-- account --> */
  'account_edit':{ }, /* <!-- account_edit --> */
  'api':{}, // <!-- api -->
  'blocks':[],
  'comment':{ }, /* <!-- comment --> */
  'comment_edit':{ }, /* <!-- comment_edit --> */
  'entity_info':{ }, /* <!-- entity_info --> */
  'field_info_fields':{ }, /* <!-- field_info_fields --> */
  'field_info_instances':{ }, /* <!-- field_info_instances --> */
  'form':{ }, /* <!-- form --> */
  'form_state':{ }, /* <!-- form_state --> */
  'form_errors':{ }, /* <!-- form_errors --> */
  'node':{ }, /* <!-- node --> */
  'node_edit':{ }, /* <!-- node_edit --> */
  'menus':{},
  'menu_links':{}, /* <!-- menu_links --> */
  'menu_router':{}, /* <!-- menu_router --> */
  'page':{'variables':{}}, /* <!-- page --> */
  'path':'', /* The current menu path. */
  'services':{}, // <!-- services -->
  'taxonomy_term':{ }, /* <!-- taxonomy_term -> */
  'taxonomy_term_edit':{ }, /* <!-- taxonomy_term_edit -> */
  'taxonomy_vocabulary':{ }, /* <!-- taxonomy_vocabulary -> */
  'taxonomy_vocabulary_edit':{ }, /* <!-- taxonomy_vocabulary_edit -> */
  'title':'',
  'themes':[],
  'theme_registry':{},
  'views_datasource':{}, // <!-- views_datasource -->
}; // <!-- drupalgap -->

/**
 * Given a path to a javascript file relative to the app's www directory,
 * this will load the javascript file so it will be available in scope.
 */
function drupalgap_add_js() {
	var data;
	if (arguments[0]) { data = arguments[0]; }
	jQuery.ajax({
    async:false,
    type:'GET',
    url:data,
    data:null,
    success:function(){
      if (drupalgap.settings.debug) {
        // Print the js path to the console.
        console.log(data);
      }
    },
    dataType:'script',
    error: function(xhr, textStatus, errorThrown) {
      console.log('drupalgap_add_js - error');
      console.log(JSON.stringify(xhr));
      alert('drupalgap_add_js - error - (' + data + ' : ' + textStatus + ') ' + errorThrown);
    }
	});
}

/**
 * Rounds up all blocks defined by hook_block_info and places them in the
 * drupalgap.blocks array.
 */
function drupalgap_blocks_load() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_blocks_load()');
      console.log(JSON.stringify(arguments));
    }
    drupalgap.blocks = module_invoke_all('block_info');
    if (drupalgap.settings.debug) {
      console.log(JSON.stringify(drupalgap.blocks));
    }
  }
  catch (error) {
    alert('drupalgap_blocks_load - ' + error);
  }
}


/**
 * Takes option set 2, grabs the success/error callback(s), if any, 
 * and appends them onto option set 1's callback(s), then returns
 * the newly assembled option set.
 */
function drupalgap_chain_callbacks(options_set_1, options_set_2) {
	
	//console.log(JSON.stringify(options_set_1));
	//console.log(JSON.stringify(options_set_2));
	
	// Setup the new options.
	var new_options_set = {};
	$.extend(true, new_options_set, options_set_1);
	
	// Chain the success callbacks.
	if (options_set_2.success) {
		if (new_options_set.success) {
			if (!$.isArray(new_options_set.success)) {
				var backup = new_options_set.success;
				new_options_set.success = [];
				new_options_set.success.push(backup);
			}
			new_options_set.success.push(options_set_2.success);
		}
		else {
			new_options_set.success = options_set_2.success; 
		}
	}
	
	// Chain the error callbacks.
	if (options_set_2.error) {
		if (new_options_set.error) {
			if (!$.isArray(new_options_set.error)) {	
				var backup = new_options_set.error;
				new_options_set.error = [];
				new_options_set.error.push(backup);
			}
			new_options_set.error.push(options_set_2.error);
		}
		else {
			new_options_set.error = options_set_2.error; 
		}
	}
	
	// For all other variables in option set 2, add them to the new option set.
	$.each(options_set_2, function(index, object){
		if (index != 'success' && index != 'error') {
			new_options_set[index] = object;
		}
	});
	
	// Return the new option set.
	//console.log(JSON.stringify(new_options_set));
	return new_options_set;
}

/**
 *
 */
function drupalgap_changePage(path) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_changePage()');
      console.log(JSON.stringify(arguments));
    }
    alert('drupalgap_changePage - this function is deprecated!');
  }
  catch (error) {
    alert('drupalgap_changePage - ' + error);
  }
}

/**
 * Checks the devices connection and sets drupalgap.online to true if the
 * device has a connection, false otherwise.
 * @returns A string indicating the type of connection according to PhoneGap.
 */
function drupalgap_check_connection() {
    // TODO - Uncomment and use this line once cordova 2.3 is released
    // instead of the navigator.network.connection.type variable.
    //var networkState = navigator.connection.type;
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';
    
    if (states[networkState] == 'No network connection') {
    	drupalgap.online = false;
    }
    else {
    	drupalgap.online = true;
    }

    return states[networkState];
}

/**
 * Implements PhoneGap's deviceready().
 */
function drupalgap_deviceready() {
  // PhoneGap is loaded and it is now safe for DrupalGap to start...
  // Load up settings.
  drupalgap_settings_load();
  // Load up includes.
  drupalgap_includes_load();
	// Load up modules.
	drupalgap_modules_load();
	// Load up the theme.
	drupalgap_theme_load();
	// Load up blocks.
	drupalgap_blocks_load();
	// Initialize menu links.
	menu_router_build();
	// Initialize menus.
	drupalgap_menus_load();
	// Initialize the theme registry.
	drupalgap_theme_registry_build();
	// Verify site path is set.
	if (!drupalgap.settings.site_path || drupalgap.settings.site_path == '') {
		navigator.notification.alert(
		    'No site path to Drupal set in the DrupalGap/app/settings.js file!',
		    function(){},
		    'Error',
		    'OK'
		);
		return false;
	}
	// Check device connection.
	drupalgap_check_connection();
	if (!drupalgap.online) {
		module_invoke_all('device_offine');
		// Device is off-line.
		navigator.notification.alert(
		    'No connection found!',
		    function(){ $.mobile.changePage(drupalgap.settings.offline); },
		    'Offline',
		    'OK'
		);
		return false;
	}
	else {
		// Implementations of hook_device_online().
		module_invoke_all('device_online');
		
		if (module_invoke_continue) {
			
			// Device is online, let's make a call to the
			// DrupalGap System Connect Service Resource.
			drupalgap.services.drupalgap_system.connect.call({
				'success':function(result){
				  // Call all hook_device_connected implementations then go to
				  // the front page.
					module_invoke_all('device_connected');
					drupalgap_goto('');
				},
				'error':function(jqXHR, textStatus, errorThrown) {
					if (errorThrown == 'Not Found') {
						navigator.notification.alert(
						    'Review DrupalGap Troubleshooting Topics!',
						    function(){},
						    'Unable to Connect to Drupal',
						    'OK'
						);
					}
				}
			});
			
		}
	}
}

/**
 * Checks if a given file exists, returns true or false.
 * @param  {string} path 
 *   A path to a file
 * @return {bool}      
 *   True if file exists, else flase
 */
function drupalgap_file_exists(path) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_file_exists(' + path + ')');
    }
    var file_exists = false;
    jQuery.ajax({
      async:false,
      type:'HEAD',
      url:path,
      success:function(){ file_exists = true; },
      error:function(xhr, textStatus, errorThrown) { }
    });
    return file_exists;
  }
  catch (error) {
    alert('drupalgap_file_exists - ' + error);
  }
}

/**
 * Reads entire file into a string and returns the string. Returns false if
 * it fails.
 */
function drupalgap_file_get_contents(path) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_file_get_contents(' + path + ')');
    }
    var file = false;
    jQuery.ajax({
      type:'GET',
      url:path,
      dataType:'html',
      data:null,
      async:false,
      success:function(data){ file = data; },
      error: function(xhr, textStatus, errorThrown) {
        console.log('drupalgap_file_get_contents - failed to load file (' + path + ')');
      }
    });
    return file;
  }
  catch (error) {
    alert('drupalgap_file_get_contents - ' + error);
  }
}


/**
 * 
 * @param count
 * @param singular
 * @param plural
 * @returns
 */
function drupalgap_format_plural(count, singular, plural) {
  try {
    if (count == 1) {
      return singular;
    }
    return plural;
	}
	catch (error) {
	  alert('drupalgap_format_plural - ' + error);
	}
	return null;
}

/**
 * Given a JS function, this returns true if the function is available in the
 * scope, false otherwise.
 */
function drupalgap_function_exists(name) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_function_exists(' + name + ')');
    }
    return (eval('typeof ' + name) == 'function');
  }
  catch (error) {
    alert('drupalgap_function_exists - ' + error);
  }
}

/**
 * Given an html string from a *.tpl.html file, this will extract all of the
 * placeholders names and return them in an array. Returns false otherwise.
 */
function drupalgap_get_placeholders_from_html(html) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_get_placeholders_from_html()');
      console.log(JSON.stringify(arguments));
    }
    var placeholders = false;
    if (html) {
      placeholders = html.match(/(?!{:)([\w]+)(?=:})/g);
    }
    return placeholders;
  }
  catch (error) {
    alert('drupalgap_get_placeholders_from_html - ' + error);
  }
}


/**
 * 
 * @param type
 * @param name
 */
function drupalgap_get_path(type, name) {
  try {
    var path = '';
    var found_it = false;
    if (type == 'module') {
      $.each(drupalgap.modules, function(bundle, modules){
        $.each(modules, function(index, module){
          if (name == module.name) {
            path = drupalgap_modules_get_bundle_directory(bundle) + '/';
            path += module.name;
            found_it = true;
          }
          if (found_it) {
            return false;
          }
        });
        if (found_it) {
          return false;
        }
      });
    }
    return path;
  }
  catch (error) {
    alert('drupalgap_get_path - ' + error);
  }
	return null;
}

/**
 * Implementation of drupal_get_title().
 */
function drupalgap_get_title() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_get_title()');
      console.log(JSON.stringify(arguments));
    }
    return drupalgap.title;
  }
  catch (error) {
    alert('drupalgap_get_title - ' + error);
  }
}

/**
 * 
 * @param uri
 * @returns
 */
function drupalgap_image_path(uri) {
	try {
		var src = drupalgap.settings.site_path + drupalgap.settings.base_path + uri;
		if (src.indexOf('public://') != -1) {
			var src = src.replace('public://', drupalgap.settings.file_public_path + '/');
		}
		return src;
	}
	catch (error) {
		alert('drupalgap_image_path - ' + error);
	}
	return null;
}

/**
 * Loads the js files in DrupalGap/includes specified by drupalgap.includes.
 */
function drupalgap_includes_load() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_includes_load()');
      console.log(JSON.stringify(drupalgap.includes));
    }
    if (drupalgap.includes != null && drupalgap.includes.length != 0) {
      $.each(drupalgap.includes, function(index, include){
          var include_path =  'DrupalGap/includes/' + include.name + '.inc.js';
          jQuery.ajax({
              async:false,
              type:'GET',
              url:include_path,
              data:null,
              success:function(){
                if (drupalgap.settings.debug) {
                  // Print the include path to the console.
                  console.log(include_path.replace('DrupalGap/', ''));
                }
              },
              dataType:'script',
              error: function(xhr, textStatus, errorThrown) {
                  // Look at the `textStatus` and/or `errorThrown` properties.
              }
          });
      });
    }
  }
  catch (error) {
    alert('drupalgap_includes_load - ' + error);
  }
}

/**
 * Given a module name, this will return the module inside drupalgap.modules.
 */
function drupalgap_module_load(module_name) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_module_load()');
      console.log(JSON.stringify(arguments));
    }
    var loaded_module = null;
    $.each(drupalgap.modules, function(bundle, modules){
        if (!loaded_module) {
          $.each(modules, function(index, module){
              if (module.name == module_name) {
                // Save reference to module, then break out of loop.
                loaded_module = module;
                return false;
              }
          });
        }
        else {
          // Module loaded, break out of loop.
          return false;
        }
    });
    if (drupalgap.settings.debug) {
      console.log(JSON.stringify(loaded_module));
    }
    return loaded_module;
  }
  catch (error) {
    alert(' - ' + error);
  }
}

/**
 *
 */
function drupalgap_modules_get_bundle_directory(bundle) {
  try {
    dir = '';
    if (bundle == 'core') { dir = 'DrupalGap/modules'; }
    else if (bundle == 'contrib') { dir = 'DrupalGap/app/modules'; }
    else if (bundle == 'custom') { dir = 'DrupalGap/app/modules/custom'; }
    return dir;
  }
  catch (error) {
    alert('drupalgap_modules_get_bundle_directory - ' + error);
  }
  return '';
}

/**
 * Loads each drupalgap module so they are available in the JS scope.
 */
function drupalgap_modules_load() {
	if (drupalgap.modules != null && drupalgap.modules.length != 0) {
		$.each(drupalgap.modules, function(bundle, modules){
			$.each(modules, function(index, module){
				// Determine module directory.
				dir = drupalgap_modules_get_bundle_directory(bundle);
				module_base_path = dir + '/' + module.name;
				// Add module .js file to array of paths to load.
				module_path =  module_base_path + '/' + module.name + '.js';
				modules_paths = [module_path];
				// If there are any includes with this module, add them to the list of
				// paths to include.
				if (module.includes != null && module.includes.length != 0) {
					$.each(module.includes, function(include_index, include_object){
						modules_paths.push(module_base_path + '/' + include_object.name + '.js');
					});
				}
				// Now load all the paths for this module.
				$.each(modules_paths, function(modules_paths_index, modules_paths_object){
					jQuery.ajax({
					    async:false,
					    type:'GET',
					    url:modules_paths_object,
					    data:null,
					    success:function(){
					    	if (drupalgap.settings.debug) {
					    		// Print the module path to the console.
					    		console.log(modules_paths_object.replace('DrupalGap/', ''));
					    	}
					    },
					    dataType:'script',
					    error: function(xhr, textStatus, errorThrown) {
					        // Look at the `textStatus` and/or `errorThrown` properties.
					    }
					});
				});
			});
		});
		// Now invoke hook_install on all modules.
		module_invoke_all('install');
	}
}

/**
 * Implementation of drupal_set_title().
 */
function drupalgap_set_title(title) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_set_title(' + title + ')');
    }
    if (title) { drupalgap.title = title; }
  }
  catch (error) {
    alert('drupalgap_set_title - ' + error);
  }
}

/**
 * Loads the settings specified in DrupalGap/app/settings.js into the app.
 */
function drupalgap_settings_load() {
  try {
    settings_file_path = 'DrupalGap/app/settings.js';
    jQuery.ajax({
      async:false,
      type:'GET',
      url:settings_file_path,
      data:null,
      success:function(){
        if (drupalgap.settings.debug) {
          // Set the title to the settings title.
          drupalgap_set_title(drupalgap.settings.title);
        }
      },
      dataType:'script',
      error: function(xhr, textStatus, errorThrown) {
        navigator.notification.alert(
          'Failed to load the settings.js file in the DrupalGap/app folder!',
          function(){},
          'Error',
          'OK'
        );
      }
    });
  }
  catch(error) {
    alert('drupalgap_settings_load - ' + error);
  }
}

/**
 * Load the theme specified by drupalgap.settings.theme into drupalgap.theme
 */
function drupalgap_theme_load() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_theme_load()');
      console.log(JSON.stringify(arguments));
    }
    if (!drupalgap.settings.theme) {
      alert('drupalgap_theme_load - no theme specified in settings.js');
    }
    else {
      var theme_name = drupalgap.settings.theme;
      drupalgap_add_js('DrupalGap/themes/' + theme_name + '/' + theme_name + '.js');
      var template_info_function = theme_name + '_info';
      if (drupalgap_function_exists(template_info_function)) {
        var fn = window[template_info_function];
        drupalgap.theme = fn();
        if (drupalgap.settings.debug) {
          console.log('theme loaded: ' + theme_name);
          console.log(JSON.stringify(drupalgap.theme));
        }
      }
      else {
        alert('drupalgap_theme_load() - failed - ' + template_info_function + '() does not exist!');
      }
    }
  }
  catch (error) {
    alert('drupalgap_theme_load - ' + error);
  }
}

/**
 * This calls all implements of hook_theme and builds the DrupalGap theme
 * registry.
 */
function drupalgap_theme_registry_build() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_theme_registry_build()');
      console.log(JSON.stringify(arguments));
    }
    var modules = module_implements('theme');
    $.each(modules, function(index, module){
        var function_name = module + '_theme';
        var fn = window[function_name];
        var hook_theme = fn();
        $.each(hook_theme, function(element, variables){
            variables.path = drupalgap_get_path('module', module);
            eval('drupalgap.theme_registry.' + element + ' = variables;');
        });
    });
  }
  catch (error) {
    alert('drupalgap_theme_registry_build - ' + error);
  }
}

/**
 * This is called once the <body> element's onload is fired. We then set the
 * PhoneGap 'deviceready' event listener to drupalgap_deviceready().
 */
function drupalgap_onload() {
	document.addEventListener("deviceready", drupalgap_deviceready, false);
}

/*
 * Given a drupal permission machine name, this function returns true if the
 * current user has that permission, false otherwise. Here is example input
 * that checks to see if the current user has the 'access content' permission.
 * 	Example Usage:
 * 		user_access = drupalgap_user_access({'permission':'access content'});
 * 		if (user_access) {
 * 			alert("You have the 'access content' permission.");
 * 		}
 * 		else {
 * 			alert("You do not have the 'access content' permission.");
 * 		}
 */
function drupalgap_user_access(options) {
	try {
		// Make sure they provided a permission.
		if (options.permission == null) {
			alert("drupalgap_user_access - permission not provided");
			return false;
		}
		// User 1 always has permission.
		if (drupalgap.user.uid == 1) {
			return true;
		}
		// For everyone else, assume they don't have permission. Iterate over
		// drupalgap.user.permissions to see if the current user has the given
		// permission, then return the result.
		access = false;
		if (drupalgap.user.permissions && drupalgap.user.permissions.length != 0) {
      $.each(drupalgap.user.permissions, function(index, permission){
        if (options.permission == permission) {
          access = true;
          return;
        }
      });
		}
		return access;
	}
	catch (error) {
		alert("drupalgap_user_access - " + error);
	}
	return false;
}

$('.drupalgap_front').live('click', function(){
    drupalgap_changePage(drupalgap.settings.front);
});

// http://stackoverflow.com/a/3886106/763010
function is_int(n) {
   return typeof n === 'number' && n % 1 == 0;
}

