#pragma pattern_limit 2000000
struct Date1 {
  u8 ss;
  u8 mm;
  u8 hh;
  u8 none;
  u8 dd;
  u8 MM;
  u16 yyyy;
};

struct Header {
  char fileExtension[0x04];
  u32 fileSize;
  
  // always 
  u8 unknown0x008[0x04];
  u8 FileIdentifier[0x04];//Checked on read, along with fileExtension for correct file format
  
  Date1 date1;
  Date1 date2;
  Date1 date3;
  
  // some parts are always empty
  u8 empty[0x08];
  
  char16 pcname1[0x20];
  char16 pcname2[0x20];
  
  // 0x0B0
  u32 numberOfThings;//the ones staring at the b8 offset
  
  u32 unknown;
  u32 unknownOffset;
  padding[0x44];
  char16 fileName[0x100 / 2];
  //you get to the thing at desired index by << 5 so 86 << 5 becomes 10c0 offset compared to start things
  //because each thing is 0x20 long

}; 

struct thing {
  u32 width;
  u32 height;
  u32 pallete; //0xffffffff means no pallete, 0x00000000 seems to indicate palette at start of file (0x200 offset)
  u32 textureOffset;
  u32 unknown[2];//always 0? Maybe for inserting the pallete PTR at runtime?
  u32 widthAgain;
  u32 heightAgain;
};

struct pixelData{
u8 b;
u8 g;
u8 r;
u8 a;
};

struct Palette {
    u8 unknown[parent.header.unknownOffset - 0x200];
};


struct gfx{
  Header header;
  Palette pal;
  thing thingArray[header.numberOfThings];

  //for(int i = 0; i < header.numberOfThings; i++)
  pixelData data[thingArray[0].width * thingArray[0].height];
  
};

gfx File@0x0;