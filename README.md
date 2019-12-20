# SMG UntisParser #
Parse teacher substitution schedules from the Sebastian-Münster-Gymnasium.

## Install ##
You need to provide your own *cheerio* instance since this package needs to be compatible with React Native.

``` yarn add smg-untis-parser ```

and

``` yarn add cheerio ``` or ``` yarn add react-native-cheerio ```

## Usage ##
```
import cheerio from 'cheerio'; // 'react-native-cheerio'
import UntisParser from 'smg-untis-parser';

const parser = new UntisParser(cheerio, data);
const timetables = parser.timetables;
```