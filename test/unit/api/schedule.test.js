import {readFileSync} from "fs";
import {timePlayed} from "../../../app/redux-actions";

describe('API - Schedule', function () {
  it('should return pong', function () {
    const json = JSON.parse(readFileSync('test/unit/api/schedule.json', 'utf-8'));
  })
})
