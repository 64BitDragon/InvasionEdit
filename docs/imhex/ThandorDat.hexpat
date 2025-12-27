bitfield mouse_commands{
    unsigned rotateZoom : 1;
    unsigned rotateTilt : 1;
    unsigned noScroll   : 1;
    unsigned reserved   : 5;
    unsigned u32Fill    : 24;
};

bitfield general_settings{
    unsigned autoZoom  : 1;
    unsigned audoRot   : 1;
    unsigned hidePanel : 1;
    unsigned reserved  : 5;
    unsigned u32Fill   :24;
};

bitfield audio_toggles{
    unsigned soundEnable : 1;
    unsigned musicEnable : 1;
    unsigned flipStereo  : 1;
    unsigned reserved    : 5;
    unsigned u32Fill     :24;
};

enum language: u32 {
    English = 0x2c, //(LCID & 0x1ff) == 0x0009 
    German = 0x31,  //(LCID & 0x1ff) == 0x0007
    French = 0x21,  //(LCID & 0x1ff) == 0x000c
    Spanish = 0x22, //(LCID & 0x1ff) == 0x000a
    Italian = 0x27, //(LCID & 0x1ff) == 0x0010
    Russian = 0x7,  //(LCID & 0x1ff) == 0x0019
    Auto = 0        // Use getLocale to set language. Thandor only uses primary language bits
};

struct datFile{
    u32 unknown0x00;                // weird value, seems to get reset during run-time?
    u32 width;                      // dat04 is width (1280)
    u32 height;                     // dat08 is height (720)
    u32 colour;                     // dat0c is colour bits
    u32 shading0;                   // dat10 is shading
    u32 shading1;                   // dat14 is shading
    u32 shadingcount;               // dat18 is shading count (not size)
    u32 shadingbool;                // dat1c is shading bool
    audio_toggles audioToggles;     // dat20 is audio toggles: bit 0 for sound ; bit 1 for music ; bit 2 for left/right (positive means ticked)
    u32 volumeEffects;              // dat24 is volume effects 0x8000 max, 0 min
    u32 volumeFilm;                 // dat28 is volume film general 0x8000 max, 0 min
    u32 volumeMusic;                // dat2c is volume music 0x8000 max, 0 min
    u32 textureResolution;          // dat30 is texture resolution
    u32 polygonResolution;          // dat34 is polygon resolution (0x40000 max, 0x4000 min)
    language languageID;            // dat38 is languageID, see https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-lcid/70feba9f-294e-491e-b6eb-56532684c37f for list of IDs (0x009 is english). FUN_005872F0 searches for userLocale if not set in thandor.dat
    u32 maxPlayerCount;             // dat3c is max player count lobby
    general_settings general;       // dat40 is general bit 0 for zoom, rot, hide panel
    u32 difficulty;                 // dat44 is difficulty slider 0x78 max, 0x50 min
    u32 scrollSpeed;                // dat48 is scroll speed 0x80 max, 0x8 min
    u32 volumeFilmProd;             // dat4c is volume film prod 0x8000 max, 0 min
    u32 unknown0x50[4];
    mouse_commands mousecommands;   // dat5c is mouse commands: bit 0 for rot/zoom ; bit 1 for rot/tilt ; bit 2 for right no scroll (positive means ticked)

    char16 playerName[20];    
    char16 roomName[20];
};
datFile file @ 0x0;

