import defaultSettings from "./defaults";

//adds to local storage or retrieves from local storage
function load_settings() {
    if (localStorage.getItem('settings') == 'null' || localStorage.getItem('settings') == 'undefined'){
        localStorage.setItem('settings', JSON.stringify(defaultSettings));
    }
    return JSON.parse(localStorage.getItem('settings'));
}


export default load_settings;