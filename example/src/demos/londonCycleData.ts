import { parseString } from 'xml2js';
import * as promisify from 'es6-promisify';
export interface Station {
  id: string;
  name: string;
  position: number[];
  bikes: number;
  slots: number;
}

export type StationDict = { [id: string]: Station };

const parse = promisify(parseString);

// tslint:disable-next-line:no-any
const normalize = (station: any) => ({
  id: station.id[0],
  name: station.name[0],
  position: [parseFloat(station.long[0]), parseFloat(station.lat[0])],
  bikes: parseInt(station.nbBikes[0], 10),
  slots: parseInt(station.nbDocks[0], 10)
});

export const getCycleStations = () =>
  fetch(
    'https://tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml'
  )
    .then(res => res.text())
    .then(parse)
    .then(res => res.stations.station.map(normalize))
    .then((stations: Station[]) =>
      // tslint:disable-next-line:no-object-literal-type-assertion
      stations.reduce(
        (acc, station) => ((acc[station.id] = station), acc),
        {} as StationDict
      )
    );
