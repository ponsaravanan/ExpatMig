﻿DECLARE @CurrentMigration [nvarchar](max)

IF object_id('[dbo].[__MigrationHistory]') IS NOT NULL
    SELECT @CurrentMigration =
        (SELECT TOP (1) 
        [Project1].[MigrationId] AS [MigrationId]
        FROM ( SELECT 
        [Extent1].[MigrationId] AS [MigrationId]
        FROM [dbo].[__MigrationHistory] AS [Extent1]
        WHERE [Extent1].[ContextKey] = N'ExpatMig.Migrations.Configuration'
        )  AS [Project1]
        ORDER BY [Project1].[MigrationId] DESC)

IF @CurrentMigration IS NULL
    SET @CurrentMigration = '0'

IF @CurrentMigration < '201609070635279_AutomaticMigration'
BEGIN
    CREATE TABLE [dbo].[ThreadSubscriptions] (
        [ThreadSubscriptionID] [int] NOT NULL IDENTITY,
        [ThreadID] [int] NOT NULL,
        [UserID] [int] NOT NULL,
        [IsActive] [bit] NOT NULL,
        [SeqNo] [int] NOT NULL,
        [CreatedBy] [int] NOT NULL,
        [CreatedDate] [datetime] NOT NULL,
        [ModifiedBy] [int],
        [ModifiedDate] [datetime],
        CONSTRAINT [PK_dbo.ThreadSubscriptions] PRIMARY KEY ([ThreadSubscriptionID])
    )
    CREATE INDEX [IX_ThreadID] ON [dbo].[ThreadSubscriptions]([ThreadID])
    CREATE INDEX [IX_UserID] ON [dbo].[ThreadSubscriptions]([UserID])
    ALTER TABLE [dbo].[ThreadSubscriptions] ADD CONSTRAINT [FK_dbo.ThreadSubscriptions_dbo.Threads_ThreadID] FOREIGN KEY ([ThreadID]) REFERENCES [dbo].[Threads] ([ThreadID]) ON DELETE CASCADE
    ALTER TABLE [dbo].[ThreadSubscriptions] ADD CONSTRAINT [FK_dbo.ThreadSubscriptions_dbo.AspNetUsers_UserID] FOREIGN KEY ([UserID]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
    INSERT [dbo].[__MigrationHistory]([MigrationId], [ContextKey], [Model], [ProductVersion])
    VALUES (N'201609070635279_AutomaticMigration', N'ExpatMig.Migrations.Configuration',  0x1F8B0800000000000400ED1DD96EDCC8F13D40FE61304F49E0D5483276E118D22E64C9DE08B16CC1236FF226509CD68830879C25395E0941BE2C0FF9A4FC42BA79F5597DF01C7909038686DD5D5D5D5D471F555DFFFBCF7F4F7E7ADC84B3AF284983383A9D1F1D1CCE6728F2E35510AD4FE7BBECFEBB57F39F7EFCE31F4EDEAE368FB35FAA7A2F493DDC324A4FE70F59B67DBD58A4FE03DA78E9C126F093388DEFB3033FDE2CBC55BC383E3CFCEBE2E8688130883986359B9D7CDA4559B041F90FFCF33C8E7CB4CD765E7815AF509896DF71C932873AFBE06D50BAF57C743A7FFBB8F5B2AB607D70E165DE7C7616061E466289C2FBF9CC8BA238F3328CE2EBCF295A66491CAD97B87AE085374F5B84EBDD7B618A4AD45FD3EAB6A3383C26A358D08615287F9766F1C611E0D1CB922C0BB17923E2CE6BB261C2BDC504CE9EC8A873E29DCECFF1CFF94CECE8F57998904A0C5D8B293820F55FCCAAAF2FEAB9C72C42FEBD989DEFC26C97A0D308EDB2C40B5FCCAE777761E0FF1D3DDDC45F50741AEDC29045092385CBB80FF8D375126F51923D7D42F70CA29717F3D9826FBB101BD74D8576C5702EA3ECE5F17CF60123E1DD85A89E7966E8CB2C4ED0CF28428997A1D5B5976528C11377B94239ED240C84FE2E50EA27C1B698AEA253CC71586EE6B32BEFF13D8AD6D9C3E91CFF399FBD0B1ED1AAFA5222F2390AB098E14659B243A6BE2ED3333F0BBEA2AAA337711C222F528C4F0F67897EFD109B48A407719E2042AE374F9D80C1425C0F8AFC7D83B582332CCCB1C17DA0C0C9AE991A07B6EDC9828A9356C87E4EE2DDD645CAF206A38859DE731339AB1BEE97A01D7F7FD881A02DC3DD5AD3C9D161179D4CD2DC489A1BC26986D407EF6BB0CED95704FB74F38047BB4AE7B34F28CC6BA40FC1B658821C1465B7574FA5267897C49B4F31E9862FB9BDF19235CA305EB1B27819EF12BFA9162A60B9A8A1A2C5287AA8E8BA8922A22D87D24496AA6F5267933A7B3EEAACD4546D9459A5AD006556E93A07151B6F031FD0B0A4E8B6D2C21C525C89AC61F9E2761A96C07252B0A4C138FA95F4DC48BD560D87D2AEB6FA7C52AF937A1D6EEF27B73DCB32CF7FD860A626ED7ADFFBD3EE3E7F7ADF7D6FC6856E3B2D2C9906B5926EA485CF73F54BE03A1D6CD5AD46D1C7972B77554CDA0CA585C9FF5AC5F9831597355E907C4EF14C28798E4EDC6D5989729D5826F19D54A103CE23809A715FD572140E249DCB5CA8AC4A706CC2B055176DAC44D5B73D0CC70DF27277C72C155C37CB6CEB1137CE2C1ACD37D12294E7B5E4CBB9AD258C699535F62AABE14244E25FF5AA04AE06EC5ED5755DB7B284356DF12EEA6A7126556CF0CDEBB5B27067DB2D565239D6055EF6FA51683AADB2147DBDDD7841D8C132CBA297F338BA0F920D5AB5556DD75E9AFE1627ABBF79E943EFBB9E25F2770926E432F336DBDE7BBB7E8823F461B7B9239C3E5C5F9D4DCDCD6FF13BCFC72CF93622AD5AC37B1FFB5FE25DF636CA55F7E7CC77DD23D7003A41E7CCF7519ABEC3CC8C56E7F12ECADAAF17C6DEE69C875EB051EF7304FD795B55A596415D43320C4035571BF63E5E07911DAA555518D5A28611D5B29AFBC9F105FA1A606651624B2017E592AD158AA4C363B15C757AAC438C40B123615913A6605EC148C0A256479BDC9C719AED72F3A6D31200D0426DF7C83975073985CC7BFAC50B775D77D5801D73E5D08C1DF3A6A3B063DE33FEFC355811D56371F85255C6E0ADEAABCF75CC4C2F60065F671CBFEAC4268AEB2176984377EE2E84D6FC4A4D860BABD256A39D0D16DD37394CE25B0FAA485B1EFF9C6D834F681DA49898FC19586F0A55A453CF1D914EDA13695B32E2E4F0FA7B3E8EA31CA55CD1D2E25BAA10B825ADBA86B4E806AAB9AEBDC1333887FD80B8DC86F60B8D2C054B4F7B4B415B8D622978B5E26A295C94D2E4B23F69B04E3518A795BA5460A29630E8B9C6CB4A3C9EFBC0EDDE996936DAC2B2ECBFE9CA9269FE9C96961F02FF4BEFDAE65D90A499E14CB39B9EDE7B037534E499FC9B20C91E2EBC27A34E919C65888AB78B3C3368B6604DB61ED1FA269640192E791EF1AF00453ED5883196599B1B162C1CFDF34B107D41ABCBFE0DEE2F41EA0D7214463AFA39F1A2EC63E4CA2FCBDDDD2EB99BD61EDFFCDA433EE322A6EB3AF0BB9F7B78A346550AB8FD2911BBE5EAF2DB204515E5764855AF81E77FE27DC5EB15B5CF445EF63E5EDF5E3D71CB20C667425D450E0600EAB9EE2DA901309298ADAAA630ADA1253053ADD54AB2A68193F35BD5681C9FB7AAF746AE6E6CE3215790D60B57C31A2F0CD60FD9758891A357EABDD990825A4D1624059EE7715A5FD35F203FD878E17C769DE0BFCAA7265ECD674BDF23A3B78488AD185E49FC03DDA541D6BF9527CB2A1FCFF855FC15B91BFAC90237B2C0FB1213C759976E2D91E4BD67B058B64833F26A4099ABA94298A9A04197ADE56287CED234F6831C3DCE0BB88E33E407FC365ACDF44187851EA04E95581960F313107F08DCFDE9FC2F12114198F53281C22C631F79904773D1567D8C2E5088323423724FF4DBB997FADE4AE63A4C9515FF059B3794106BE2115F3D72051544996C0B83C80FB65EA8455C68A5B4A1C0C30F04B5BA13B1E4026D51442C9E762A5AF65E772210CC449F9305C352064EE3C39640AE006298184E2B02401D180D084E3531EF1E709A12739BB98642FBDD584D39176DBB1F80D7A470258835E0D825CA1C6CA85B8F0CA2414AC1B1621494491A1AB11F441D1B0E504639D9B31E44039BAED5915343A9394D5084DE121A2224446DC58750B99A5D7D88C573508DE6610CA727CDF3F70C9426E0FB0CF191C9119AB29014CF3288163578602B7569E96CDB8B32D5D36B0095AA27880D0260F4EA18EC59FABBDB4EBFE8FCBE6FEC2978DD2BD9B374BE1D843D797A8DC09E3C41F69E3D01C70568FA4D5E0C74FA590FA54138D3E421465163DD6C7B614A3D956C7842E72AE5C49E7AAA7481CA004C2A7ADD412C00BAE0359B7B18B082A98654C78D981218C3002A1298166BDDB82F2BCB22CECAD6320A4157FB66B8F968AFA1B7E85A628D60B5396AECBDD1865E0270D83B43FAB1F34DFAB3D59786B10CC0A48669DB7BFD09798BE8ACACD6758437E3F50D9A9B1DD7399DB06A30BFA9E7411F1E1C1C75A3FF0C88D84CADFAD17B67C3AC21B80D168213E238EA10B85A05B594E99E955187D4E1C5410B9A3C8AACF8780F34A07E1CB6FA07F4E1765386FA49EB0499417995BD53377392F282BD333E555DCC0FA60BB5680CA409B584B63A04E77D9F46B7B78CEBA08D3154F911766A6D151E8806061B5FFFE9F11FC146CBB36483041F71300067164E3CB84D865BA044DE4D5FDC9142F49829DC48F1784B4FD2B4F4BA13D98B005FA28C9238209156D47388E3298939F9D6B96F89AA75E9C363685EE77590DA57F78F2600E5ABE572FBC25BC4D0BC7CF9451E3B73F76F00C16FF76160F440C08A26ECAE05A60FBFCF34002E5C226450D24ED27AC4D533499A2197576BD620ABE78C3420CBEB108BD1D661841234F618D300889EDFAA00B1C7F41618959A0842A93612261EA9CCAD9235E85A4600C3E81B91DF68CA01A6923A2981A8008DEE8235F68CC04B6AD4E820C840A9B48E68B6F8F1D98C5D78535B31768DFB1A8FB5DA818D1D7BA9AB744357BBAC9909D860ECF2DBCEF2E8F50E551CEAA04B15837CA9213504007DA0182892C66DCF06BA174D2179B0F0F5319DED69B94565068C52A3F7EFE9858FA0B7F364BAD9789A68CFDC055F13663825076BE863F00B51F2573594CE69545939338D54EE0EDA71090E0FAD682438272869540DA5358DA02700641AD9DCB973E332DCBA33E3E28CBD865286CB7281EAF5585A1349BCC95550477BD92BED2F55D7BD76D86B410184E843964A23601625C5F5A3C305642B41E22F0B87B66510A7585D83395D84756BBFFAE624E87E05102AE3558CD3658C301EBA31304899EEFA8565AC725BDF9E9FA0B82B053FD9DC2338DD24B0FCC46C79746C64B83BB0247B2B4271D15E3A328147D80E87D86D48A43AB6EE8387808355839C4147B02E87B06DA54C71ECDA864055805E7DB657979D2C8ABCEBE587930590A0FDE4CADB6EF18C3109DBCB2FB36591ADFDFCBBA57B2EF34D0163E17306523C89AC7BCAE2C45B23A114778D31CD9FC52189E2EF3C12007ABEDA48D5942799C08147D525775829CF5D75045255277FD741C53479FD818A9B2809DFE15191AC5FF900113FD18A66B82109A7F612316EB73C2A3E8FC3DD26D29F64C350B897D358505C813D3C1A1FCD02A35FED219511D22C98F2933D0C26449A2313FDEC0CAB084956402B0AECE1B1B1D22C38F6BB3B34193DBE448678B210F852BA7A90185FBAC7E1C5C84AC8CAD3B5E642A63C26B49032A01D44D83AAE95A52918EC0AC3E95AD08A14959C74E45F26519D44B56351AD4EF19ACBAAFAD8D24258A186106D69941B4B5738F60D8634C9BD052E93DC7FD3725F5C25B510FBFC7ABC81D4ABDB81425F25B4E6645E9D1E5B0BA733E53109BD1EC624F466A187208A59AA5998625913A879326A35D0BC686FD41374D26EBD4BA7EE370DF6EA9AC6A00CAE04E953041EC0ADC9FF7CFBE2CBDECC8778CBD076666A5FA6A6B3030380685CC50BB1548662886028D513212C14E8D9909117F5FCCD49DB053EE728D674B1AF07A2B7DD62BA63D98EEBD32A9B7BE862755085FB485CE60465B2E8CFCDA28F24E9904F95AD6C8B9E9BEE826D84D08FC52C73F1B200CA4F8E309874AE1230A6CC1E2A9F719785C997B8C8309756979765AEC8014BF6A17E0E49B6A0113C80A2EA1A0E3A5A4A97CBE96AA9D41EB222712E0B5A51DC00B60267B1CC61452FE7D6E556F572B19B0593D7A3F4EBDEE83EC9CBAE8B4569E16DDE66550A40E8470D76B3A86532927226997E768455E61C958095DFF79085402F4977162AA20BDAB0100001D6315C2E505EC5681398C230AFD9049F9C1AD7253885E1B931EA88AB29D817D4961398C8107726D035D6D19666A614290C650635CE56EB5D8C223F2767A5E462975358D5789B8C957F5D498606BDBBA41B374DB9C90F987E9FF682D35EB063EDC57A9E37D75E4C389ABBF6D2351E4EFE26BFA74902475B3FD40EA2ED161080E7B3E50A026CAD33F8CCC31CA2DDD7BCD9A187D97E11516462E4AE46F22FF61098348B2C18E6B3C376DE5381A25FC73B80A1D9105960F4ABCB6514FB5A017F29A57BC70086283C51C449B2FEF52218269B41913BB863BE3B1DB1E5791585B3B5FC9B0377D4691339EEA8BFDA43A279115948F4AB1BA43AF1A108AC2E70A054990D91A354F96D32A9DFAE49D51C14D45912857382FAFBDE186826BEA5C57D68FD3A42836B50B82D78EECD66C0E38EBCE1BC7A3A787D987A21CB1D6766F92287F37EFE3D2779E40D8C069BE54E46B2F8EE0A4DC8702783152AB89938369B9D68E6D8B249F57EBBAAB757652905948955EADECB2FF5EF3AA0AC0CE6E2A2CC722A9098B17CF46919582646771555488AC9E2501933D0539AA14DA16897BF86E7215ECA65B4C2951705F728CD8A8CA4F3E3C3A3E3F9EC2C0CBCB408FF2BE3D65E8B8F5A5905B21DBD24816C68B55988CDDDC3E10894345D710953E56CAE8AD7E1AC52AAAA97E0E66CAA7CD2F38050D6982AD531BD2377C652F4137DF512FFC14BFEB4F11EFFCC026C9216FB2EC8DA25E4CC47DD361D670B206CDECB15FE3BEB2619A780910D695599385518C9B0ACD315AB92435A7138108D6166F1BAE1383CCE25B53DFEFED0754E0ADF6F0DCCA343679893083512A1C6D96C2D51B2CFF9AD4A0267977A1BF060B4C8BB5DB7EC518E54B22A3D477919ADD0E3E9FC5F799BD7B3CB7FDE96CD5ECC3E267849F07A7638FBF724C29308EFB508CB514F9612AC0E75B210E0AA618FF2AB541216025CB59B247892E051D7B1322C31CAAA831D8C1063E50CD15AC940714B769A46F6C4322B19D2A647FD52DCA989726852308400E4AFFCF38BD965FA390A7EDDE1821B4C5AA26838E5F043572A5E1797643703903F9C75A662F384555DB8E9EBA2552B6D5D21ECD671D1CAA163C735351C8FE4B2BED6C71DD9AEB54528DFAADDAE5C001AB060BB8E270BAC82F55C4E92B47146CFD6C295314BDAE5EB0FAEB321C62E3567773E62A983B59010AFD40144CE5DA65B789D90500E4C6A0E4B1189D46EB52B462035474D1172D45CBFD16023D7B55FD572B4B59F22FAE7D92AA7D1168B4CE0510712CD461EF5BDF902A277EC58C010ACA36871AD0BC6B1DE6198194DC04C773272FCCADDCAB0A3E818F6403C6CCD26507C8FFD0E118A71B1DBFCD1D67D2B8E3196F88A90A20E148848B30E8055410D6E1462DBB6A4138D449AEEE87FE73B2B2868C74E25E98274CC2A099486C92D6562F9FE581E8C91B137C3A09FAC9D1D669A0F6B885D8FE0F3609B0E048609B7E9001A8DB8D9C323041A74D36E77CE87DBB82D15D8B6AD960A42808E1B165C63080DAB232D26AAA740E13E8C3D67D55285F474C18175544F07C068604F47C0EAC09E761C5805F64C06F3DB3498CABD781DB6D3DF610910066379E906C7BD58DCB5B18D7BB6BC6A1B6FB913AE1BB7D2DE42F44D07722CC4DE385E20B28DDBD8033660A76478E4071B2F24A102F8AF34F7F93F7A8527D6F708D0E3663D08B13B1DD04F0CDC6927AE935655C1DA5BBF4026AD137715AFCE8CCC64942A332B1748B0E9D1AF766116909B51DC1B667829ACF16374814294A119E1132213E75EEA7B2B79F018E315D47B95C896E9BEFAC4F7FF1709AC29857D49F820F283AD1772A3156A296D0198B4E1645103154B2ED0164544AFF3A36BD95D0D5520AB89005CAE2F03AF6832493799ADBEB825F775E5BA2FBEF4C22B0EB307BFE7EBC22D40DE03B7EE06E0167DE66D65C66C6ED2D8CF83F08DE04027E3428B7AE124ED9BF13617B64E7C647C07DDD6E96F28E5639BB27C9F3491ECE427E3C2177F1B3ACAE6C5F6BD535836C9DDE10CC9DCCC4A65032BB0C20B44ADC1CAB25E18CDFC9C778F7A0C7A3AD7C1D1790C3653BDFCFA4CD8ACF03451B35959F6EDB119F4BCEE9EB119BDD9BC059F95652695B98465E793FD3C087331FE292C1EECE75E584AFBECA4DBADB3135F691FEB75EF7700C6A218DF2A1CA1F759718DC55B23A82B47B6829E451CC5202A323CED355B8DBD6F1CD51A5A6F1E4735868ACDE333D35DFBB2951C81D91AEE2647D569CC0D1AEB84009F81E5777CACE6C83FF0537878707024CD226FDE2AA722D1BED5DFFB39B9929E9102E6047ABAD5D1B2295DA7802E0D0FBC0EA37EAA4BDFDBAB27D8F5ABD54CF6A576EA8B724EDBD0AFBDF093EB1C1BDE8D74D1359AB7351BF43B286F3197DBBDEA99717862481DE3C60586D74007B737D4F5AE1D1BF4B80B9BCC94D8A5FE69F31E78487875B31AB9F842A6C442E5439E0CA5E633EA6CC0B153F1BAE6E97C7547DC3B0A67055C12E0DD9DAC5D78B8A5778104B8FCAE829C17992157174012E8AA4005BB28B3005E5C34CBB08BEF4AD0A4C80C99BD0D95C9CD14AAFA384BB71F5056ECABED3AA25B56A0335A01EE90A66BB69B147EFB024C105F099E2C3EFBB00901695327F52ED5D08FDB85D0E58D8C86D2650D7D97E57D957DBFE511BDA6DFB286BEDFF202C3D42F7BCC2675C916AA7A638FB04D1DB167D652476CA1AA23368991CD886A8BA51C525D0A8DE9BACAD6629410BABC9205839629E5813E3A2FF6C2D80651186B97B01953899344B5D31867EB39359E3F405F7E910C9C7C69CF34AA3E89AB0C1E7D9BA1F11E4CAAA1697C9C9AA1C9B7620D44D1A8F8D27A6892BB8D62707A971CC5A1266B02981C91C567CD30D54644C832A982D2644E358E2120EF5AF8917431DBA0598372D2B72707E0C5A0A0848DBF83FE5494198B5466C51D9CE553E6B1ED9E2095B9321304CCC9DA1F413893ACCCCADA9E20C0CDB082203677C8DC4064D32BA6E5D391415E21882949DB0F5EBCBD548C5A7BC1D9CBFC0F3170F52D9B851428AEE37A1682516C06C40D565747BD10640CEB01DD5B006262BCE2509C3AB1F39A7F300886B0C296720C76C00DC0F1BC8A1B6C4EF2DB0E013A6D65279F7EED70F8EC09B276F0E05173CBF9EE7FB0C041A981BFA123D5BD626F29934E5D76B228F685E507FC53CA9873B2F8B48B486451F1EB02A5C19A8238C13023E4736788759DCBE83EAE0E34058CAA2A626413CABC959779674916DC7B7E868BC9EB6D989FE6B3FCA12CF286E01D896EFEB8CBB6BB0C0F196DEE428E98E44854D7FFC942C2F9E463711AD4C510309A0109C6FA18BDD905E1AAC6FB9D22180B0041CE5ACB884F3297E4CD20B47EAA217D88234B4025F9EA23E21BB4D9861858FA315A7A2436CF1D37CC81EFD1DAF39FAEEB47B72020E689E0C97E721178D85A6CD212066D8F7F621E5E6D1E7FFC3FC85B20BF651E0100 , N'6.1.3-40302')
END
