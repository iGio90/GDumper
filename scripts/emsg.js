/**
 * @enum EMsg
 */

module.exports = {
    // Client Messages
    'ClientHello': 10100,
    'Login': 10101,
    'ClientCapabilities': 10107,
    'KeepAlive': 10108,
    'AuthenticationCheck': 10112,
    'SetDeviceToken': 10113,
    'ResetAccount': 10116,
    'ReportUser': 10117,
    'AccountSwitched': 10118,
    'UnlockAccount': 10121,
    'AppleBillingRequest': 10150,
    'GoogleBillingRequest': 10151,
    'KunlunBillingRequest': 10159,
    'ChangeAvatarName': 10212,
    'AskForPlayingGamecenterFriends': 10512,
    'AskForPlayingFacebookFriends': 10513,
    'InboxOpened': 10905,
    'UnbindFacebookAccount': 12211,
    'RequestSectorState': 12903,
    'SectorCommand': 12904,
    'GetCurrentBattleReplayData': 12905,
    'SendBattleEvent': 12951,
    'GoHome': 14101,
    'EndClientTurn': 14102,
    'StartMission': 14104,
    'HomeLogicStopped': 14105,
    'CancelMatchmake': 14107,
    'ChangeHomeName': 14108,
    'VisitHome': 14113,
    'HomeBattleReplay': 14114,
    'HomeBattleReplayViewed': 14117,
    'AcceptChallenge': 14120,
    'CancelChallengeMessage': 14123,
    'BindFacebookAccount': 14201,
    'BindGamecenterAccount': 14212,
    'BindGoogleServiceAccount': 14262,
    'CreateAlliance': 14301,
    'AskForAllianceData': 14302,
    'AskForJoinableAlliancesList': 14303,
    'AskForAllianceStream': 14304,
    'JoinAlliance': 14305,
    'ChangeAllianceMemberRole': 14306,
    'KickAllianceMember': 14307,
    'LeaveAlliance': 14308,
    'DonateAllianceUnit': 14310,
    'ChatToAllianceStream': 14315,
    'ChangeAllianceSettings': 14316,
    'RequestJoinAlliance': 14317,
    'SelectSpellsFromCoOpen': 14318,
    'OfferChestForCoOpen': 14319,
    'RespondToAllianceJoinRequest': 14321,
    'SendAllianceInvitation': 14322,
    'JoinAllianceUsingInvitation': 14323,
    'SearchAlliances': 14324,
    'SendAllianceMail': 14330,
    'AskForAllianceRankingList': 14401,
    'AskForTVContent': 14402,
    'AskForAvatarRankingList': 14403,
    'AskForAvatarLocalRanking': 14404,
    'AskForAvatarStream': 14405,
    'AskForBattleReplayStream': 14406,
    'AskForLastAvatarTournamentResults': 14408,
    'RemoveAvatarStreamEntry': 14418,
    'AvatarNameCheckRequest': 14600,
    'LogicDeviceLinkCodeStatus': 16000,
    'AskForJoinableTournaments': 16103,
    'SearchTournaments': 16113,

    // Server Messages
    'ServerHello': 20100,
    'LoginFailed': 20103,
    'LoginOk': 20104,
    'FriendList': 20105,
    'KeepAliveOk': 20108,
    'ChatAccountBanStatus': 20118,
    'BillingRequestFailed': 20121,
    'UnlockAccountOk': 20132,
    'UnlockAccountFailed': 20133,
    'AppleBillingProcessedByServer': 20151,
    'GoogleBillingProcessedByServer': 20152,
    'KunlunBillingProcessedByServer': 20156,
    'ShutdownStarted': 20161,
    'AvatarNameChangeFailed': 20205,
    'AvatarInGameStatusUpdated': 20206,
    'AllianceOnlineStatusUpdated': 20207,
    'BattleResult': 20225,
    'AvatarNameCheckResponse': 20300,
    'OpponentLeftMatchNotification': 20801,
    'OpponentRejoinsMatchNotification': 20802,
    'SectorHearbeat': 21902,
    'SectorState': 21903,
    'BattleEvent': 22952,
    'PvpMatchmakeNotification': 22957,
    'OwnHomeData': 24101,
    'OwnAvatarData': 24102,
    'OutOfSync': 24104,
    'StopHomeLogic': 24106,
    'MatchmakeInfo': 24107,
    'MatchmakeFailed': 24108,
    'AvailableServerCommand': 24111,
    'UdpConnectionInfo': 24112,
    'VisitedHomeData': 24113,
    'HomeBattleReplayData': 24114,
    'ServerError': 24115,
    'HomeBattleReplayFailed': 24116,
    'ChallengeFailed': 24121,
    'CancelChallengeDone': 24124,
    'CancelMatchmakeDone': 24125,
    'FacebookAccountBound': 24201,
    'FacebookAccountAlreadyBound': 24202,
    'GamecenterAccountAlreadyBound': 24212,
    'FacebookAccountUnbound': 24213,
    'GoogleServiceAccountBound': 24261,
    'GoogleServiceAccountAlreadyBound': 24262,
    'AllianceData': 24301,
    'AllianceJoinFailed': 24302,
    'AllianceJoinOk': 24303,
    'JoinableAllianceList': 24304,
    'AllianceLeaveOk': 24305,
    'ChangeAllianceMemberRoleOk': 24306,
    'KickAllianceMemberOk': 24307,
    'AllianceMember': 24308,
    'AllianceMemberRemoved': 24309,
    'AllianceList': 24310,
    'AllianceStream': 24311,
    'AllianceStreamEntry': 24312,
    'AllianceStreamEntryRemoved': 24318,
    'AllianceJoinRequestOk': 24319,
    'AllianceJoinRequestFailed': 24320,
    'AllianceInvitationSendFailed': 24321,
    'AllianceInvitationSentOk': 24322,
    'AllianceFullEntryUpdate': 24324,
    'AllianceCreateFailed': 24332,
    'AllianceChangeFailed': 24333,
    'AllianceRankingList': 24401,
    'AllianceLocalRankingList': 24402,
    'AvatarRankingList': 24403,
    'AvatarLocalRankingList': 24404,
    'RoyalTVContent': 24405,
    'LastAvatarTournamentResults': 24407,
    'AvatarStream': 24411,
    'AvatarStreamEntry': 24412,
    'BattleReportStream': 24413,
    'AvatarStreamEntryRemoved': 24418,
    'InboxList': 24445,
    'InboxGlobal': 24446,
    'InboxCount': 24447,
    'Disconnected': 25892,
    'LogicDeviceLinkCodeResponse': 26002,
    'LogicDeviceLinkNewDeviceLinked': 26003,
    'LogicDeviceLinkCodeDeactivated': 26004,
    'LogicDeviceLinkResponse': 26005,
    'LogicDeviceLinkDone': 26007,
    'LogicDeviceLinkError': 26008,

    // Value-to-name mapping for convenience

    // Client Messages
    '10100': 'ClientHello',
    '10101': 'Login',
    '10107': 'ClientCapabilities',
    '10108': 'KeepAlive',
    '10112': 'AuthenticationCheck',
    '10113': 'SetDeviceToken',
    '10116': 'ResetAccount',
    '10117': 'ReportUser',
    '10118': 'AccountSwitched',
    '10121': 'UnlockAccount',
    '10150': 'AppleBillingRequest',
    '10151': 'GoogleBillingRequest',
    '10159': 'KunlunBillingRequest',
    '10212': 'ChangeAvatarName',
    '10512': 'AskForPlayingGamecenterFriends',
    '10513': 'AskForPlayingFacebookFriends',
    '10905': 'InboxOpened',
    '12211': 'UnbindFacebookAccount',
    '12903': 'RequestSectorState',
    '12904': 'SectorCommand',
    '12905': 'GetCurrentBattleReplayData',
    '12951': 'SendBattleEvent',
    '14101': 'GoHome',
    '14102': 'EndClientTurn',
    '14104': 'StartMission',
    '14105': 'HomeLogicStopped',
    '14107': 'CancelMatchmake',
    '14108': 'ChangeHomeName',
    '14113': 'VisitHome',
    '14114': 'HomeBattleReplay',
    '14117': 'HomeBattleReplayViewed',
    '14120': 'AcceptChallenge',
    '14123': 'CancelChallengeMessage',
    '14201': 'BindFacebookAccount',
    '14212': 'BindGamecenterAccount',
    '14262': 'BindGoogleServiceAccount',
    '14301': 'CreateAlliance',
    '14302': 'AskForAllianceData',
    '14303': 'AskForJoinableAlliancesList',
    '14304': 'AskForAllianceStream',
    '14305': 'JoinAlliance',
    '14306': 'ChangeAllianceMemberRole',
    '14307': 'KickAllianceMember',
    '14308': 'LeaveAlliance',
    '14310': 'DonateAllianceUnit',
    '14315': 'ChatToAllianceStream',
    '14316': 'ChangeAllianceSettings',
    '14317': 'RequestJoinAlliance',
    '14318': 'SelectSpellsFromCoOpen',
    '14319': 'OfferChestForCoOpen',
    '14321': 'RespondToAllianceJoinRequest',
    '14322': 'SendAllianceInvitation',
    '14323': 'JoinAllianceUsingInvitation',
    '14324': 'SearchAlliances',
    '14330': 'SendAllianceMail',
    '14401': 'AskForAllianceRankingList',
    '14402': 'AskForTVContent',
    '14403': 'AskForAvatarRankingList',
    '14404': 'AskForAvatarLocalRanking',
    '14405': 'AskForAvatarStream',
    '14406': 'AskForBattleReplayStream',
    '14408': 'AskForLastAvatarTournamentResults',
    '14418': 'RemoveAvatarStreamEntry',
    '14600': 'AvatarNameCheckRequest',
    '16000': 'LogicDeviceLinkCodeStatus',
    '16103': 'AskForJoinableTournaments',
    '16113': 'SearchTournaments',

    // Server Messages
    '20100': 'ServerHello',
    '20103': 'LoginFailed',
    '20104': 'LoginOk',
    '20105': 'FriendList',
    '20108': 'KeepAliveServer',
    '20118': 'ChatAccountBanStatus',
    '20121': 'BillingRequestFailed',
    '20132': 'UnlockAccountOk',
    '20133': 'UnlockAccountFailed',
    '20151': 'AppleBillingProcessedByServer',
    '20152': 'GoogleBillingProcessedByServer',
    '20156': 'KunlunBillingProcessedByServer',
    '20161': 'ShutdownStarted',
    '20205': 'AvatarNameChangeFailed',
    '20206': 'AvatarInGameStatusUpdated',
    '20207': 'AllianceOnlineStatusUpdated',
    '20225': 'BattleResult',
    '20300': 'AvatarNameCheckResponse',
    '20801': 'OpponentLeftMatchNotification',
    '20802': 'OpponentRejoinsMatchNotification',
    '21902': 'SectorHearbeat',
    '21903': 'SectorState',
    '22952': 'BattleEvent',
    '22957': 'PvpMatchmakeNotification',
    '24101': 'OwnHomeData',
    '24102': 'OwnAvatarData',
    '24104': 'OutOfSync',
    '24106': 'StopHomeLogic',
    '24107': 'MatchmakeInfo',
    '24108': 'MatchmakeFailed',
    '24111': 'AvailableServerCommand',
    '24112': 'UdpConnectionInfo',
    '24113': 'VisitedHomeData',
    '24114': 'HomeBattleReplay',
    '24115': 'ServerError',
    '24116': 'HomeBattleReplayFailed',
    '24121': 'ChallengeFailed',
    '24124': 'CancelChallengeDone',
    '24125': 'CancelMatchmakeDone',
    '24201': 'FacebookAccountBound',
    '24202': 'FacebookAccountAlreadyBound',
    '24212': 'GamecenterAccountAlreadyBound',
    '24213': 'FacebookAccountUnbound',
    '24261': 'GoogleServiceAccountBound',
    '24262': 'GoogleServiceAccountAlreadyBound',
    '24301': 'AllianceData',
    '24302': 'AllianceJoinFailed',
    '24303': 'AllianceJoinOk',
    '24304': 'JoinableAllianceList',
    '24305': 'AllianceLeaveOk',
    '24306': 'ChangeAllianceMemberRoleOk',
    '24307': 'KickAllianceMemberOk',
    '24308': 'AllianceMember',
    '24309': 'AllianceMemberRemoved',
    '24310': 'AllianceList',
    '24311': 'AllianceStream',
    '24312': 'AllianceStreamEntry',
    '24318': 'AllianceStreamEntryRemoved',
    '24319': 'AllianceJoinRequestOk',
    '24320': 'AllianceJoinRequestFailed',
    '24321': 'AllianceInvitationSendFailed',
    '24322': 'AllianceInvitationSentOk',
    '24324': 'AllianceFullEntryUpdate',
    '24332': 'AllianceCreateFailed',
    '24333': 'AllianceChangeFailed',
    '24401': 'AllianceRankingList',
    '24402': 'AllianceLocalRankingList',
    '24403': 'AvatarRankingList',
    '24404': 'AvatarLocalRankingList',
    '24405': 'RoyalTVContent',
    '24407': 'LastAvatarTournamentResults',
    '24411': 'AvatarStream',
    '24412': 'AvatarStreamEntry',
    '24413': 'BattleReportStream',
    '24418': 'AvatarStreamEntryRemoved',
    '24445': 'InboxList',
    '24446': 'InboxGlobal',
    '24447': 'InboxCount',
    '25892': 'Disconnected',
    '26002': 'LogicDeviceLinkCodeResponse',
    '26003': 'LogicDeviceLinkNewDeviceLinked',
    '26004': 'LogicDeviceLinkCodeDeactivated',
    '26005': 'LogicDeviceLinkResponse',
    '26007': 'LogicDeviceLinkDone',
    '26008': 'LogicDeviceLinkError'
};