import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'boldMatchingText'
})
/**
 * Marks as bold matching substring in a string
 */
export class BoldMatchingText implements PipeTransform {

    constructor(private domSanitizer: DomSanitizer) {}

    transform(searchString: string, allString: string): any {
        if (!searchString) { 
            return allString; 
        } else if(!allString) {
            return "";
        }
        // Check if search string is a substring of pivot string (no case-sensitive)
        const idxOfMatchString = allString.toLowerCase().indexOf(searchString.toLowerCase());
        if(idxOfMatchString !== -1) {
            // retrieve the exactly substring
            const matchingString = allString.substring(idxOfMatchString, idxOfMatchString + searchString.length);
            // Replace original string marking as <strong> (bold) the matchinng substring
            const regEx = new RegExp(matchingString, 'gi'); 
            const res = allString.replace(regEx, "<strong>" + matchingString + "</strong>");
            return this.domSanitizer.bypassSecurityTrustHtml(res);
        } 

        return allString;
        
    }
}