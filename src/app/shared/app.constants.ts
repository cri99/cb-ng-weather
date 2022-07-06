let browserLanguage = navigator.language;
if(browserLanguage && browserLanguage.length > 2) {
    browserLanguage = browserLanguage.substring(0, 2).toLocaleLowerCase();
}
 
export const DEFAULT_LANGUAGE = browserLanguage || "it";



