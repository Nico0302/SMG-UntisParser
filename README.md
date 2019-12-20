# SMG UntisParser #
Parse Sebastian-Münster-Gymnasium teacher substitution schedules.

## Installation ##
You need to provide your own *cheerio* instance since this package needs to be compatible with *react-native*.

``` yarn add @nico0302/smg-untis-parser ```

and

``` yarn add cheerio ``` or ``` yarn add react-native-cheerio ```

## Usage ##
```
import cheerio from 'cheerio'; // 'react-native-cheerio'
import UntisParser from '@nico0302/smg-untis-parser';

const parser = new UntisParser(cheerio, data);
const timetables = parser.timetables;
```