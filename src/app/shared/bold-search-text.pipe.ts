import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'boldMatchingText'
})

export class BoldMatchingText implements PipeTransform {

    constructor(private domSanitizer: DomSanitizer) {}

    transform(matchString: string, args: string): any {
        if (!matchString) { 
            return args; 
        }
        const regEx = new RegExp(matchString, 'gi'); 
        const res = args.replace(regEx, "<strong>" + matchString + "</strong>");
        return this.domSanitizer.bypassSecurityTrustHtml(res);
    }
}