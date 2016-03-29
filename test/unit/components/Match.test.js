import {readFileSync} from "fs";
import {equal} from "assert";
import moment from "moment-timezone";
import Match from "../../../app/components/Match";

describe('Match', function () {
  describe('#gameState', function () {

    it ('blah', () => {
      var s = '2016-03-29T18:30:00+02:00';
      const fmt = moment.tz(s, 'Europe/Oslo').format("HH:mm");
      equal(fmt, '18:30');
    });

    it('should work', function () {
      const json = JSON.parse(readFileSync('test/unit/api/schedule.json', 'utf-8'));
      const now = moment("2016-03-29T18:20:00+02:00");
      const state = (n) => Match.gameState(json.matches[n], now);
      equal(state(0), 'FT');
      equal(state(2), 'AVL');
      equal(state(13), '88\'');
      equal(state(18), 'HT');
      equal(state(19), '31\'');
      // console.log(json.matches[26]);
      equal(state(26), '18:30');
    })
  })
});
