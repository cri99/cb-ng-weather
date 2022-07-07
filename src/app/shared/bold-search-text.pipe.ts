import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'boldMatchingText'
})

export class BoldMatchingText implements PipeTransform {

    constructor(private domSanitizer: DomSanitizer) {}

    transform(searchString: string, allString: string): any {
        if (!searchString) { 
            return allString; 
        } else if(!allString) {
            return "";
        }
        const idxOfMatchString = allString.toLowerCase().indexOf(searchString.toLowerCase());
        if(idxOfMatchString !== -1) {
            const matchingString = allString.substring(idxOfMatchString, idxOfMatchString + searchString.length);
            const regEx = new RegExp(matchingString, 'gi'); 
            const res = allString.replace(regEx, "<strong>" + matchingString + "</strong>");
            return this.domSanitizer.bypassSecurityTrustHtml(res);
        } 

        return allString;
        
    }
}