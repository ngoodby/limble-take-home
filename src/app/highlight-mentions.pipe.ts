import { Pipe, PipeTransform } from '@angular/core';

/**
 * Use regex to identify mentioned within a comment and apply conditional formatting.
 *
 * @export
 * @class HighlightMentionsPipe
 * @typedef {HighlightMentionsPipe}
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'highlightMentions',
  standalone: true,
})
export class HighlightMentionsPipe implements PipeTransform {
  transform(value: string): string {
    const mentionRegex = /@(\w+)/g;
    return value.replace(
      mentionRegex,
      '<span class="text-blue-500 rounded-md px-1 bg-blue-100 font-bold">@$1</span>'
    );
  }
}
