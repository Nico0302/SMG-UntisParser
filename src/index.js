import moment from 'moment';

/**
 * Class for parsing SMG teacher substitution schedules.
 */
class UntisParser {
    /**
     * Create a UntisParser.
     * 
     * @param {Object} cheerio - cheerio instance
     * @param {String} data - HTML Source
     */
    constructor(cheerio, data) {
        this._$ = cheerio.load(data);
        this.timetables = [];
        this.parse();
    }

    parse() {
        this._$('div[class=mon_title]').each((index, date) =>
            this.prepareTimetable(index, date)
        );
        this._$('table[class=mon_list]').each((index, timetable) =>
            this.parseTimetable(index, timetable)
        );
    }

    prepareTimetable(timetableIndex, dateElement) {
        const dateString = this._$(dateElement)
            .text()
            .split(' ')[0];
        const date = moment(dateString, 'D.M.YYYY').toISOString();

        this.timetables[timetableIndex] = { date, data: [] };

        // check for timetable info
        const infoElement = this._$(dateElement).next();
        if (infoElement.hasClass('info'))
            this.timetables[timetableIndex].info = infoElement
                .text()
                .replace(/^\s+|\s+$/g, '');
    }

    parseTimetable(timetableIndex, timetable) {
        this._$(timetable)
            .find('tr')
            .each((index, row) => {
                try {
                    this.parseTimetableRow(timetableIndex, index, row);
                } catch (error) {
                    if (error.message !== 'Missing mandatory value!')
                        throw error;
                }
            });
    }

    parseTimetableRow(timetableIndex, rowIndex, row) {
        let entry = {};

        this._$(row)
            .find('td')
            .each((index, cell) => {
                const plainValue = this._$(cell)
                    .text()
                    .trim();
                const columProperties = timetableColumns[index];

                if (!columProperties.ignore) {
                    const value = columProperties.value
                        ? columProperties.value(plainValue)
                        : plainValue;
                    if (value) entry[columProperties.key] = value;
                }
            });
        if (Object.keys(entry).length > 0)
            this.timetables[timetableIndex].data.push(entry);
    }
}

/**
 * Colum formatting options
 */
const timetableColumns = [
    {
        ignore: true
    },
    {
        key: 'classes',
        value: classes =>
            classes.split(', ').map(className => className.replace(/^0+/, ''))
    },
    {
        key: 'lesson'
    },
    {
        key: 'subject',
        value: subject => subject.replace(/_/g, ' ')
    },
    {
        key: 'room',
        value: room => (room === '---' ? null : room)
    },
    {
        key: 'substitute',
        value: substitute =>
            substitute === '---' || substitute === '???' ? null : substitute
    },
    {
        key: 'type'
    },
    {
        key: 'swap',
        value: swap => (swap === '' ? null : swap)
    },
    {
        key: 'detail',
        value: detail => (detail === '' ? null : detail)
    }
];

export default UntisParser;
