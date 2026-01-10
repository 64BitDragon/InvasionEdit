import { LevEntity } from "./LevEntity";
import { MapSize } from "../constants/MapSize";
import { PlanetName } from "../constants/PlanetName";
import { LevPlayerMeta } from "./LevPlayerMeta";
import { LevRGBA } from "./LevRGBA";
import { LevFileArrayOffset } from "./LevFileArrayOffset";

export type PlayerCount = 1 | 2 | 3 | 4 | 5 | 6;
export const MIN_PLAYER_COUNT = 2;
export const MAX_PLAYER_COUNT = 6;

export interface LevFile {
    name: string;
    fileSize: number;
    pcName1: string;
    pcName2: string;
    levelName: string;
    fromPlayers: string;
    toPlayers: string;
    difficulty: number;
    mapTextIndex: number;
    planetName: PlanetName;
    mapSize: MapSize;
    fldLinkOffset: number;
    gfxSoilOffset: number;
    gfxWaterOffset: number;
    gfxSkyOffset: number;
    mdlArmyOffset: number;
    gfxShotOffset: number;
    gfxEffectenOffset: number;
    flmOffset: number;
    soundOffset: number;
    techOffset: number;
    entityCount: number;
    entityOffset: number;
    mldOffset: number;//for now we're just using a general mldOffset with size derived from entityOffset, this may need to be changed later
    armFiles: LevFileArrayOffset;
    mldFiles: LevFileArrayOffset;
    effFiles: LevFileArrayOffset;
    shtFiles: LevFileArrayOffset;
    mdls: string[];
    entities: LevEntity[];
    playerCount1: number;
    playerCount2: number;
    playerMeta: LevPlayerMeta[];
    buildingFilter1: LevRGBA;
    buildingFilter2: LevRGBA;
    environmentFilter1: LevRGBA;
    environmentFilter2: LevRGBA;
    allyStates: number;
    peaceStates: number;
    ally0x318: number;
}
