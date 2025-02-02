/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiResponse<T> = {
    status: {
        code: number,
        message?: string,
        version: number // usually 1
    },
    data?: T
}


//* Responses
//#region
export type LoginResult = {
    sessionToken: string,
    sessionTtl: number;
    refreshToken: string;
    playerId: number;
    playerNew: boolean;
    playerNewlyRegistered: boolean;
    playerNewlyInAppFam: boolean;
    policyAccepted: boolean;
    policyVersion: string;
    policyUrl: string;
    termUrl: string;
    accountId: number;
    /**
     * Username
     */
    handle: string;
    handleNew: boolean;
    /**
     * Username auto generated from email?
     */
    handlePrefill: boolean;
    email: string;
    emailVerified: boolean;
    newsletter: number;
    showEmailOpt: boolean;
    language: string;
    picUrl: string;
    picUrlType: string;
    loginCount: number;
    serverTime: number;
    playerStat: {
        installDate: number;
    };
    elControl: {
        npt: boolean;
    };
    standardChat: {
        jid: string;
        xmppHosts: string[];
    };
    campfireChat: {
        jid: string;
        xmppHosts: string[];
    };
    /**
     * this is usually empty
     */
    settings: string;
    birthDate: {
        year: number;
        month: number;
    };
}
export type ListEntitlementsResult = {
    /**
     * This is empty for a free account, soo...
     */
    products: Array<any>
}
export type SettingsResult = {
    "sing_google.subscriptions": sing_google_subscriptions,
    "sing_google.stream_values": sing_google_stream_values,
    "sing_google.buy_msg": sing_google_buy_msg,
    "sing_google.tutorial": sing_google_tutorial,
    "sing_google.cccp": sing_google_cccp,
    "sing_google.songbook": sing_google_songbook,
    "sing_google.preSing": sing_google_preSing,
    "sing_google.ftuxBlocking": sing_google_ftuxBlocking,
    "sing_google.songUpsell": sing_google_songUpsell,
    "sing_google.explore": sing_google_explore,
    "sing_google.mediaPlayer": sing_google_mediaPlayer,
    "sing_google.ads": sing_google_ads,
    "sing_google.smeaks": sing_google_smeaks,
    "sing.profile": sing_profile,
    "sing.playlists": sing_playlists,
    "sing.audio": sing_audio,
    "sing.audioFilters": sing_audioFilters,
    "sing.arr": sing_arr,
    "sing.onboarding": sing_onboarding,
    "sing.cccp": sing_cccp,
    "sing.acappella": sing_acappella,
    "sing.video": sing_video,
    "sing.videoEncoding": sing_videoEncoding,
    "sing.chat": sing_chat,
    "sing.search": sing_search,
    "sing.videoFX": sing_videoFX,
    "sing.videoStyles": sing_videoStyles,
    "sing.avqSurvey": sing_avqSurvey,
    "sing.paywall": sing_paywall,
    "sing.freeform": sing_freeform,
    "dfp": dfp,
    "appLaunch": sing_appLaunch,
    "sing.crm": sing_crm,
    "sing.boost": sing_boost,
    "sing.share": sing_share,
    "sing.feed": sing_feed,
    "sing.findFriendsModule": sing_findFriendsModule,
    "sing.localization": sing_localization,
    "sing.seeds": sing_seeds,
    "sing.nowPlaying": sing_nowPlaying,
    "sing.registration": sing_registration,
    "sing.upload": sing_upload,
    "sing.families": sing_families,
    "sing.appSettings": sing_appSettings,
    "campfire.avStreamQuality": campfire_avStreamQuality,
    "campfire.config": campfire_config,
    "sing.virtualCurrency": sing_virtualCurrency,
    "campfire.audioFilters": campfire_audioFilters,
    "links": links,
    "sing.singingFlow": sing_singingFlow,
    "sing.explore": sing_explore,
    "sing.songbookUsability": sing_songbookUsability,
    "sing.templates": sing_templates,
    "sing.topics": sing_topics,
    "sing.banners": sing_banners,
    "sing.shortJoins": sing_shortJoins,
    "sing.vcs": sing_vcs,
    "sing.notifications": sing_notifications,
    "sing.tipping": sing_tipping,
    "appFamily": appFamily,
}
export type LoginInfoResult = {
    notificationCount: {
        activity: number,
        pubInvite: number,
        gift: number,
    },
    feedActivity: boolean,
    apiHosts: string[],
    performanceCount: number,
    splittests: string[]
}
export type DeviceSetResult = {
    over_air_latency_v5: number
}
//? Skipping localization result, we arent using the app
export type AccessTokenResult = {
    accessToken: string
}
export type FolloweeResult = {
    followees: Array<any>, // no idea, i dont have followees
    accountApps: Array<any>,
    totalFollowees: number
}
export type SongbookResult = {
    categories: Array<SongCategory>,
    cat1Songs: Array<Song>,
    cat1Cursor: Cursor,
    disinterestedSongs: Array<Song>
}
export type BlockListResult = {
    accountIds: Array<any>
}
export type StoreSubscriptionStatus = {
    isActive: boolean,
    status: string,
    skipTrial: boolean,
    storeCancellable: boolean
}
export type PreferancesResult = {
    prefs: Array<{
        name: string,
        value: string // boolean as string
    }>
}
export type RecAccountsResult = {
    recAccountIcons: Array<{
        recId: string,
        accountIcon: AccountIcon,
        reasonType: string
    }>
}
export type CategorySongsResult = {
    songs: Array<Song>,
    cursor: Cursor
}
export type BannersResult = {
    banners: Array<Banner>
}
export type UsersLookupResult = {
    accountIcons: Array<AccountIcon>
}
export type PerformanceByKeysResult = {
    performanceIcons: Array<PerformanceIcon>
}
export type PerformancesByUserResult = {
    participationIcons: Array<{
        partCreatedAt: Date, // unix
        performanceIcon: PerformanceIcon
    }>,
    totalPerformances: number,
    accountCounters: {
        performanceCount: number
    },
    storageLimit: number,
    next: number
}
export type ProfileResult = {
    profile: {
        accountIcon: AccountIcon,
        apps: string[],
        social: {
            numFollowers: number,
            numFollowees: number
        },
        players: Array<{
            app: string,
            playerId: number
        }>,
        webUrl: string,
        sfamCnt: number,
        ownPlaylistCnt: number,
        wallet: Wallet,
        phoneConnected: boolean,
        verifiedBadgeEligible: boolean,
        verifiedBadgeUnmetCriteria: string[],
        tippingProfile: {
            tipping: any[],
            tippingEnabled: boolean,
            withTermsAndConditions: boolean
        }
    },
    followerOfViewer: boolean
}
export type WalletResult = {
    wallet: Wallet
}
export type GiftsResult = {
    gifts: Array<{
        giftIcon: GiftIcon,
        count: number
    }>,
    giftCount: number
}
export type ArrExtended = {
    arr: Arr,
    ver: number,
    processState: number,
    published: boolean,
    lyrics: boolean,
    lyricAnimationSupport: number,
    multipart: boolean,
    groupParts: boolean,
    length: number,
    pitchTrack: boolean,
    origResources: {
        role: string,
        url: string,
        id: number,
        uid: string,
        contentType: string,
        size: number,
        createdAt: number
    }[],
    normResources: {
        role: string,
        url: string,
        id: number,
        uid: string,
        contentType: string,
        size: number,
        createdAt: number
    }[],
    avTmplSegments: {
        id: number,
        start: number,
        end: number,
        type: string,
        tags: string[]
    }[],
    recAvTmplSegment: {
        id: number,
        origin: string
    },
    supportedMode: string
}
export type ArrResult = {
    arrVersion: ArrExtended 
}
export type LoginAsGuestResult = {
    loginResult: LoginResult,
    settings: SettingsResult
}
export type TrendingSearchResult = {
    recTrendingSearches: TrendingSearch[]
}
export type AutocompleteResult = {
    options: Array<{
        text: string
    }>,
    categories: string[]
}
export type SearchResult = {
    resultTypes?: SearchResultType[],
    categories?: SearchResultCategory[],
    songs?: Array<{
        type: "ARR",
        arrangementVersionLite: Arr
    }>,
    accts?: Array<AccountIcon>,
    seeds?: Array<PerformanceIcon>,
    recs?: Array<PerformanceIcon>,
    cfires?: Array<unknown>, // TODO: find out what this is
    sfams?: Array<unknown>, // TODO: find out what this is
    acctSocialMap?: {
        [key: string]: {
            numFollowers: number
        }
    },
    cursor?: Cursor
}
//#endregion




//* Others

//#region Settings
export type campfire_audioFilters = {
    audioFXOrder: string[],
    defaultFX: string,
    /**
     * This is empty for me for some reason
     */
    fxConfig: object,
    vipOnlyFX: string[]
}
export type sing_freeform = {
    audioFreeformEnabled: boolean;
    lyricScrollingEnabledFV1: boolean;
    lyricScrollingEnabledFV2: boolean;
    lyricsScrollingEnabled: boolean;
    lyricsSizeShrinkEnabled: boolean;
    lyricsSizeShrinkEnabledFV1: boolean;
    videoAddEnabled: boolean;
}
export type sing_google_ftuxBlocking = {
    block: boolean,
    headphonesScreen: boolean,
    volumeScreen: boolean
}
export type sing_google_subscriptions = {
    dailyPassEnabled: boolean,
    definitions: Array<{
        sku: string,
        trial?: boolean,
        period: string,
        label_key: string,
        description_key: string,
        trial_label_key?: string,
        trial_description_key?: string
    }>,
    paywallScreen: string,
    paywallWorkflowEnabled: boolean,
    priceTextFormat: number,
    showDisclaimer: boolean,
    showDisclaimerV2: boolean,
    showDisclaimerV2Trial: boolean,
    useFlow: string
}
export type sing_appSettings = {
    androidUIVersion: number,
    decodeCacheSize: number,
    existingUserEmailVerificationEnabled: boolean,
    groupsBottomSheetEnabled: boolean,
    idfaPrompt: boolean,
    initialTab: string,
    navBarAppearance: string,
    network_timeout: number,
    newHeaderEnabled: boolean,
    notificationBadgeAppearance: string,
    showTabLabels: boolean,
    toldYaSo: boolean
}
export type sing_videoFX = {
    airbrush: {
        enabled: boolean
    },
    default: string,
    order: Array<string>,
    vip: Array<string>
}
export type sing_vcs = {
    coinsOnboardingMsg: string,
    enabled: boolean,
    notEnoughCoinsUiVersion: number,
    savingEarlyGivesNoCoins: boolean,
    showCoinsRecTutorial: boolean
}
export type sing_registration = {
    ageGateEnabled: boolean,
    buttonLayout: string,
    carouselStringIds: Array<string>,
    contactsFindFriendsEnabled: boolean,
    emailVerificationEnabled: boolean,
    fbFindFriendsEnabled: boolean,
    lastLoginMethodEnabled: boolean,
    layout: string,
    loginButtonStringId: string,
    loopingImageEnabled: boolean,
    newHandleScreenType: string,
    onboardingFlow: number,
    phoneLoginType: string,
    phoneRegistrationEnabled: boolean,
    registerButtonStringId: string,
    registrationOptions: Array<string>,
    version: number
}
export type sing_arr = {
    logRecCompletedArr: boolean,
    unlockPrice: number
}
export type sing_boost = {
    enableBoostFeature: boolean,
    sku: string
}
export type sing_templates = {
    associations: Array<{
        arrKey: string,
        templateId: string
    }>,
    audioOverrideEnabled: boolean,
    audioOverridesPaywallEnabled: boolean,
    browsingCategories: Array<string>,
    laBrowsingCategories: Array<string>,
    singFlowEnabled: boolean,
    singingFlowTemplatesEnabled: boolean,
    studioPrivacySwitchVisible: boolean
}
export type sing_notifications = {
    activityRevampEnabled: boolean,
    becomeVipButtonEnabled: boolean,
    channelUIEnabled: boolean,
    friendIsLiveNotificationEnabled: boolean,
    giftsTabEnabled: boolean,
    giftsTabEnabledV2: boolean,
    newsCenterEnabled: boolean,
    newsCenterEnabledV2: boolean,
    notificationsFilteringEnabled: boolean,
    preserveFilterSelectionEnabled: boolean
}
export type links = {
    appsEmbed: string,
    cancelSubscriptionAndroid: string,
    cancelSubscriptionIOS: string,
    cancelSubscriptionLearnMore: string,
    cancelSubscriptionWeb: string,
    customerSupport: string,
    defaultSmuleLogo: string,
    domainWhitelist: Array<string>,
    emailShare: string,
    emailSharePerformance: string,
    fbInvite: string,
    fbInviteBanner: string,
    fbLike: string,
    help: string,
    itunesSingEmbed: string,
    patentsEmbed: string,
    privacyEmbed: string,
    smuleHomePage: string,
    songbookHelp: string,
    termOfServiceEmbed: string,
    virtualCurrencyInfo: string
}
export type sing_feed = {
    becomeVipButtonEnabled: boolean,
    socialOnlyEnabled: boolean,
    uiVersion: number
}
export type campfire_avStreamQuality = {
    audiencePlaybackBuffersMax: number,
    audiencePlaybackBuffersMin: number,
    duetVideoHeight: number,
    duetVideoMaxKbps: number,
    duetVideoMinKbps: number,
    duetVideoWidth: number,
    hostVideoMaxKbps: number,
    hostVideoMinKbps: number
}
export type sing_singingFlow = {
    audioRequestFailedDialogFix: boolean,
    audioVisualizerSwitch: string,
    defaultFormType: string,
    defaultLength: string,
    dynamicClientSegmentationEnabled: boolean,
    flowVersion: number,
    headsetAlertMode: string,
    isGuestFlowEnabled: boolean,
    joinersLAPreviewEnabled: boolean,
    laBrowsingCategories: Array<string>,
    lyricsRecyclerViewEnabled: boolean,
    matchAudioOverride: boolean,
    momentsFreeSelectionDuration: {
        min: number,
        max: number
    },
    momentsFreeSelectionEnabled: boolean,
    momentsFriendlyPreSingFV1: boolean,
    momentsFriendlyPreSingFV2: boolean,
    momentsFriendlyPreSingFV3: boolean,
    presingAndReviewLAEnabled: boolean,
    presingVersion: number,
    randomJoinEnabled: boolean,
    reactivateSeedEnabled: boolean,
    separateJoinEnabled: boolean,
    separateJoinSeedsListEnabled: boolean,
    shortOnboardingEnabled: boolean,
    shortOptionEnabled: boolean,
    shortPerfLeadInMs: number,
    shortPerfLeadOutMs: number,
    simpleJoinEnabled: boolean,
    simplifiedSingflowEnabled: boolean,
    singPauseMenuV2Enabled: boolean,
    squareStylesUXEnabled: boolean,
    startOverEnabled: boolean,
    startSingingButtonStyle: number,
    stylesCarouselV2Enabled: boolean,
    swiftEnabled: boolean
}
export type sing_google_songbook = {
    defaultSectionId: string,
    recommendedRemoveSongsEnabled: boolean,
    recommendedSectionFree: boolean,
    recommendedSectionFreeTitle: string
}
export type sing_tipping = {
    tippingProviders: Array<string>
}
export type sing_explore = {
    becomeVipButtonEnabled: boolean,
    momentsPreviewEnabled: boolean,
    momentsPreviewEnabledV2: boolean,
    orderedPlaylists: Array<number>,
    sections: Array<string>,
    seeAllLargeCellsEnabled: boolean
}
export type sing_nowPlaying = {
    audioOnlyViewStyle: string,
    audioVisualizerEnabled: boolean,
    autoJoinFromDuetEnabled: boolean,
    autoplayEnabled: boolean,
    commentLikingEnabled: boolean,
    followButtonEnabled: boolean,
    giftingCoachmarkEnabled: boolean,
    lyricVideosEnabled: boolean,
    nowPlayingGiftVIPDuration: number,
    prebufferingEnabled: boolean,
    showGroupMentionUI: boolean,
    showHeaderUI: boolean,
    uiVersion: number,
    viewStyleSwitchEnabled: boolean
}
export type dfp = {
    groupId: number,
    testId: number
}
export type sing_google_ads = {
    preload_sdks: Array<string>,
    zones: {
        launch: {
            frequency: number,
            timeout: number
        },
        cancel: {
            frequency: number
        },
        postperformance: {
            frequency: number
        },
        "singing.solo": {
            frequency: number
        },
        "singing.seed": {
            frequency: number
        }
    }
}
export type sing_findFriendsModule = {
    placements: {
        feed: {
            startingPosition: number,
            repeatInterval: number
        },
        "songbook.recommended": {
            startingPosition: number,
            repeatInterval: number
        }
    }
}
export type sing_share = {
    branchEnabled: boolean,
    exclusions: Array<string>,
    FBDirect: boolean,
    flexibleTrimmerEnabled: boolean,
    flexibleTrimmerV2Enabled: boolean,
    flexibleTrimmerV3Enabled: boolean,
    igReelsWithAttributionEnabled: boolean,
    igRenderInitialIntervalInSeconds: number,
    igRenderPollingIntervalInSeconds: number,
    igRenderPollingTimeoutInSeconds: number,
    momentsEnabled: boolean,
    shareButtonLayout: string,
    shareButtonOrder: Array<string>,
    shareButtonOrderV2: Array<string>,
    showCommentOnFeed: boolean,
    showCommentOnPlayerBar: boolean,
    snapchatShareOption: string,
    uiVersion: number
}
export type sing_google_preSing = {
    audioMode: string,
    isJoinOnBottom: boolean,
    recTypeScreen: string,
    seedScreenVersion: string
}
export type sing_avqSurvey = {
    rate: number
}
export type sing_shortJoins = {
    audioPreSingEnabled: boolean,
    enabled: boolean,
    inviteListUsesNowPlaying: boolean,
    nowPlayingEnabled: boolean,
    nowPlayingFullSongByDefault: boolean,
    nowPlayingPlaybackMode: string,
    nowPlayingSimplifiedEnabled: boolean,
    preSingEnabled: boolean,
    selectPOIForSinging: boolean
}
export type sing_songbookUsability = {
    filterButtonPlacement: string,
    freeLabelEnabled: boolean,
    searchBarVisible: string,
    songCellType: string
}
export type sing_families = {
    creationBannerEnabled: boolean,
    enabled: boolean,
    iosOnlyNotificationEnabled: boolean
}
export type sing_audio = {
    aaudioLatencyUpdateFrequency: number,
    audioInputMonitorEnabled: boolean,
    audioSystemVersion: number,
    audioWrapperVersion: number,
    autoplayOnReview: boolean,
    backgroundUpload: boolean,
    bluetoothEnabled: boolean,
    defaultSuperpoweredLatency: number,
    deviceOverrides: {
        settings: {
            audioWrapperVersion: number,
            wrapperV0: number
        },
        deviceMachines: string[]
    },
    enablePreSingAudioMonitoring: boolean,
    fileAllocationEnabled: boolean,
    fileWriterBufferSize: number,
    ioThreadOptimizationEnabled: boolean,
    midiAlignmentEnabled: boolean,
    midiAlignmentMinConfidence: number,
    mmapWorkaroundEnabled: boolean,
    monitoringFXConfigEnabled: boolean,
    monitoringParams: {
        knee: number,
        slope: number,
        target: number,
        min: number,
        max: number
    },
    oboeResamplerEnabled: boolean,
    offlineDecoding: boolean,
    openSLVer: number,
    otaBacktrackLevel: number,
    otaLatencyMethod: string,
    overrides: {
        campfireTuning: {
            vbrMin: number,
            vbrMax: number,
            playbackBufferMin: number,
            playbackBufferMax: number
        }
    },
    rtmEnabled: boolean,
    seekGlitchProtectionEnabled: boolean,
    shouldRestartOnSilenceDetected: boolean,
    showMicPermissionsPrompt: boolean,
    usePreGain: boolean,
    voiceCommWorkaroundEnabled: boolean,
    wrapperV0: number,
    wrapperVersion: number,
    writeBuffers: number
}
export type campfire_config = {
    audioOnlyEnabled: boolean,
    creationRequiresVIP: boolean,
    enabled: boolean,
    globalVideoEnabled: boolean,
    groupExperienceEnabled: boolean,
    invitationDialogsEnabled: boolean,
    maxInviteCount: number,
    openSeedsEnabled: boolean,
    previewCellType: string,
    publicExperienceEnabled: boolean,
    saveClipsEnabled: boolean,
    sessionIdentityEnabled: boolean
}
export type sing_cccp = {
    arrVisible: boolean,
    defaultSort: string,
    minTilOld: number,
    showPitchTracks: boolean
}
export type appFamily = {
    apps: string[]
}
export type sing_search = {
    autocompleteDelayMS: number,
    categoricalSearchEnabled: boolean,
    categoricalSearchOrder: string[],
    categoricalSearchV2Enabled: boolean,
    instantSearchDelayMS: number,
    lyricsSearchEnabled: boolean,
    newSearchEnabled: boolean,
    numRecsToFetch: number,
    searchByCategoriesEnabled: boolean,
    searchByCategoriesV2Enabled: boolean,
    v2Enabled: boolean
}
export type sing_localization = {
    forceLocaleSwitcher: {
        enabled: boolean,
        langOrder: string[]
    },
    localeSwitcherEnabled: boolean
}
export type sing_videoEncoding = {
    bitrate: number,
    bitrate360AVC: number,
    bitrate360HEVC: number,
    bitrate480AVC: number,
    bitrate480HEVC: number,
    bitrate720AVC: number,
    bitrate720HEVC: number,
    format: string,
    framerate: number,
    gopDuration: number,
    hdEnabled: boolean,
    resolution: number
}
export type sing_chat = {
    activityStatusEnabled: boolean,
    connectChatOnLogin: boolean,
    enabled: boolean,
    entryShortcutsEnabled: boolean,
    forceUpgrade: boolean,
    maxGroupMembers: number,
    richLinksEnabled: boolean,
    welcomePerfKey: string
}
export type sing_paywall = {
    showV2: boolean,
    stringsGroup: string,
    trialLayout: string,
    trialOfferId: string
}
export type sing_appLaunch = {
    cacheSettings: boolean,
    resumeSession: boolean,
    secureAPI: boolean
}
export type sing_acappella = {
    maxDurationSec: number,
    minDurationSec: number
}
export type sing_google_buy_msg = {
    enough_text: string,
    not_enough_text: string,
    rate_us_count_limit: number
}
export type sing_google_songUpsell = {
    enabled: boolean,
    joinNoUpload: {
        title: string,
        bullets: {
            icon: string,
            text: string
        }[]
    },
    joinUpload: {
        title: string,
        bullets: {
            icon: string,
            text: string
        }[]
    },
    seedNoUpload: {
        title: string,
        bullets: {
            icon: string,
            text: string
        }[]
    },
    seedUpload: {
        title: string,
        bullets: {
            icon: string,
            text: string
        }[]
    },
    soloNoUpload: {
        title: string,
        bullets: {
            icon: string,
            text: string
        }[]
    },
    soloUpload: {
        title: string,
        bullets: {
            icon: string,
            text: string
        }[]
    }
}
export type sing_google_stream_values = {
    demo_interval: number,
    stream_cost: number,
    stream_report_time_interval: number
}
export type sing_google_smeaks = {
    billingObfuscatedIdsEnabled: boolean,
    FTUXSongBookmarkTutorialEnabled: boolean,
    landingScreenLocationRequestEnabled: boolean,
    manageSubscriptionEnabled: boolean,
    ssd: boolean
}
export type sing_audioFilters = {
    config: {
        [key: string]: {
            versionSpec: string
        }
    },
    ctrEnabled: boolean,
    ctrEnabledForDuetJoins: boolean,
    default: string,
    defaultOTA: string,
    order: string[],
    otaConfig: {
        [key: string]: {
            versionSpec: string
        }
    },
    rnnoiseEnabled: boolean,
    vipOnly: string[],
    vocalMonitorConfig: {
        [key: string]: {
            versionSpec: string
        }
    }
}
export type sing_google_mediaPlayer = {
    foregroundServiceEnabled: boolean
}
export type sing_onboarding = {
    autoPlayOnCompletionEnabled: boolean,
    canDeferFTUX: boolean,
    extendedArrPreviewEnabled: boolean,
    flow: string,
    reboardingEnabled: boolean,
    search: boolean,
    skipTopicsEnabled: boolean,
    topics: boolean,
    topicsSource: number,
    tutorialVersion: string,
    upsellLocation: string
}
export type sing_crm = {
    appboyEnabled: boolean
}
export type sing_playlists = {
    performancePaginationEnabled: boolean
}
export type sing_seeds = {
    castJoinAsSeedEnabled: boolean,
    hotListEnabled: boolean,
    paidSeedExtensionEnabled: boolean,
    removeJoinsEntryPoint: "actionsheet",
    reopenSeedsEnabled: boolean
}
export type sing_google_explore = {
    playlistId: number
}
export type sing_banners = {
    armstrongDynamicBannersEnabled: boolean
}
export type sing_google_cccp = {
    arrVisible: boolean,
    defaultSort: string,
    joinVisible: boolean,
    tabNameKey: string
}
export type sing_videoStyles = {
    default: string,
    defaultParticleIntensity: string,
    joinersChoiceEnabled: boolean,
    order: string[],
    particlesEnabled: boolean,
    teaser: string[],
    vip: string[]
}
export type sing_profile = {
    archivedMessageOnTop: boolean,
    becomeVipButtonEnabled: boolean,
    channelSearchDebounceMS: number,
    channelSearchEnabled: boolean,
    defaultChannelLayout: string,
    familiesEnabled: boolean,
    getVerifiedButtonEnabled: boolean,
    multiplePerformancePinningEnabled: boolean,
    perfSortingEnabled: boolean,
    playlistsEnabled: boolean,
    profileStatsEnabled: boolean,
    profileViewsEnabled: boolean,
    storageBannerV2: boolean,
    storageLimit: number,
    storageLimitV2: number,
    uiVersion: number,
    verifiedBadgeUnmetCriteria: boolean,
    version: number,
    vipGiftingCoachmarkEnabled: boolean
}
export type sing_google_tutorial = {
    headphoneReminder: boolean,
    numberOfFreePlays: number,
    showSongbookTips: boolean,
    tutorialSongDoMiSo: boolean
}
export type sing_video = {
    faceTrackingEnabled: boolean,
    groupJoinLimit: number,
    nonVIPCreateLimit: number,
    numFreeJoins: number,
    singleEGLContext: boolean,
    singleEGLContextVersion: number,
    uploadRequestTimeoutSecs: number,
    uploadSliceSizeKB: number,
    uploadTimeoutSecs: number,
    uploadWifiOnly: {
        enabled: boolean,
        timeoutSec: number,
        reminderDialogThreshold: number
    },
    uploadWifiOnlySetting: boolean,
    wifiOnlyUploadTimeoutSecs: number
}
export type sing_virtualCurrency = {
    coinPackImageVersion: number,
    coinWalletDesignVersion: number,
    directGiftingEnabled: boolean,
    giftFOMOEnabled: boolean,
    giftIconBounceIntervalSec: number,
    giftingEnabled: boolean,
    giftSearchEnabled: boolean,
    giftTagsEnabled: boolean,
    highlightLiveJamGiftIcon: boolean,
    highlightNowPlayingGiftIcon: boolean,
    liveJamGiftingEnabled: boolean,
    messageCarouselEnabled: boolean,
    minibarGiftingEnabled: boolean,
    purchasingEnabled: boolean,
    seedExtensionCoachmarkEnabled: boolean,
    seedExtensionEnabled: boolean,
    seedExtensionInfoEnabled: boolean,
    showBonusCoinsInPacks: boolean,
    vipGiftingBulkLimit: number,
    vipGiftingEnabled: boolean,
    vipGiftingInGroupsEnabled: boolean,
    walletLayout: string
}
export type sing_upload = {
    requestTimeoutSec: number,
    timeoutSec: number,
    usePerformanceUploadManager: boolean,
    usePerformanceUploadManager2: boolean,
    videoSliceSizeKB: number,
    wifiOnly: {
        enabled: boolean,
        timeoutSec: number,
        reminderDialogThreshold: number
    }
}
export type sing_topics = {
    validationEnabled: boolean
}

export type Cursor = {
    next: string,
    hasNext: boolean
}
//#endregion

//#region Song-related stuff
export type SearchResultCategory = "NONE" | "TITLE" | "LYRIC" | string
export type SearchResultType = "CFIRE" | "SONG" | "ACTIVESEED" | "SFAM" | "ACCOUNT" | "RECORDING"
export enum SearchResultSort {
    POPULAR = "POPULAR",
    RECENT = "RECENT"
}

export type TrendingSearch = {
    recId: string,
    trendingSearch: string
}
export type SongCategory = {
    id: number,
    displayName: string
}
export type Song = {
    recId: string,
    arrVersionLite: Arr,
    joinableSeedCount: number
}
export type Arr = {
    key: string,
    ver: number,
    appFamily: string,
    compTitle: string,
    ownerAccountIcon: AccountIcon,
    smuleOwned: boolean,
    artist: string,
    langId: string,
    songId: string,
    rating: number,
    highlyRated: boolean,
    totalVotes: number,
    perfCount: number,
    lyrics: boolean,
    multipart: boolean,
    coverUrl: string,
    webUrl: string,
    arrCreatedAt: number,
    totalPlays: number,
    noPaywall: boolean,
    name: string,
    price: {
        vipOnly: boolean,
        price: number
    },
    avTmplSegments?: Array<{
        id: number,
        start: number,
        end: number,
        type: string,
        tags: Array<any>
    }>,
    composition?: {
        id: string,
        title: string,
        artist: string
    }
}
export type AccountIcon = {
    accountId: number;
    picUrl: string;
    picUrlType: string;
    handle: string;
    blurb: string;
    verifiedUrls: Array<{
        type: string;
        desc: string;
        url: string;
    }>;
    subApps: Array<string>;
    firstName: string;
    lastName: string;
    jid: string;
    verifiedType: string;

    // Positions for recordings and stuff
    latitude?: number,
    longitude?: number
}

export type PerformanceIcon = {
    performanceKey: string,
    playerId: number,
    accountIcon: AccountIcon,
    app: "sing";
    compType: "ARR";
    arrKey: string;
    title: string;
    artist: string;
    message: string;
    coverUrl: string;
    shortTermRenderedUrl: string;
    videoRenderedUrl: string;
    videoRenderedMp4Url: string;
    origTrackUrl: string;
    origTrackOptions: string;
    origTrackInstrumentId: string;
    origTrackPartId: number;
    origTrackCity: {
        city: string;
        country: string;
    };
    totalPerformers: number;
    totalVideoTracks: number;
    totalLoves: number;
    totalListens: number;
    totalComments: number;
    giftCnt: number;
    createdAt: number;
    webUrl: string;
    isPrivate: boolean;
    ensembleType: "SOLO" | "DUET" | "GROUP";
    childCount: number;
    lifetimeJoinCount: number;
    isJoinable: boolean;
    seed: boolean;
    liveAt: number;
    video: boolean;
    videoType: string;
    videoResolution: string;
    boost: boolean;
    formType: string;
    isCastableAsSeed: boolean;
    arrVersion?: ArrExtended;

    recentTracks?: Array<{
        accountIcon: AccountIcon
    }>
}
//#endregion

export type Banner = {
    name: string,
    destUrl: string,
    imgUrl: string,
    targetType: string,
    positionId: number
}
export type Wallet = {
    credit: number,
    earned: number,
    dailyLimitResetAt?: Date
}
export type GiftIcon = {
    id: number,
    name: string,
    type: "SYSTEM",
    animation: {
        id: number,
        type: "LOTTIE",
        speed: number,
        repeatCount: number,
        autoReverse: boolean,
        autoPlay: boolean,
        isStatic: boolean,
        minAutoPlayDelay: number,
        maxAutoPlayDelay: number,
        resources: Array<{
            id: number,
            type: "PREVIEW" | "FULL",
            resource: {
                id: number,
                url: string,
                size: number,
                contentType: string
            }
        }>
    }
}

export type PerformanceResult = {
    performance: PerformanceIcon
}
export type PerformanceList = {performanceIcons: PerformanceIcon[], next: number}
export enum PerformancesSortOrder { 
    RECENT = "RECENT",
    HOT = "HOT",
    LOVE = "LOVE",
    SUGGESTED = "SUGGESTED"
}
export enum PerformancesFillStatus { 
    ACTIVESEED = "ACTIVESEED",
    SEED = "SEED",
    FILLED = "FILLED"
}

/**
 * Used to request a list of performances for this song key with specific criterias
 */
export class PerformanceReq {
    app: string = "sing_google"
    arrKey: string = ""
    fillStatus: PerformancesFillStatus = PerformancesFillStatus.SEED
    limit: number = 25
    offset: number = 0
    sort: PerformancesSortOrder = PerformancesSortOrder.RECENT
    video: boolean = false

    /**
     * Used to request a list of performances for this song key with these criterias
     * 
     * @param key - The arr key associated with the song.
     * @param sort - The order in which performances should be sorted. Default is RECENT.
     * @param fillStatus - The fill status of the performances. Default is ACTIVESEED.
     * @param limit - The maximum number of performances to fetch. Default is 25.
     * @param offset - The starting point for fetching performances. Default is 0.
     */
    constructor(key: string, sort = PerformancesSortOrder.RECENT, fillStatus = PerformancesFillStatus.ACTIVESEED, limit = 25, offset = 0) {
        this.arrKey = key
        this.fillStatus = fillStatus
        this.limit = limit
        this.offset = offset
        this.sort = sort
    }
}

//#region Custom types
export class SmuleSession {
    sessionToken: string = ""
    refreshToken: string = ""
    isGuest: boolean = false
    expired: boolean = true
}

export const SmuleErrorCode = {
    61: "Tried to access non-guest endpoint, but you are guest",
    50: "Digest error / Digest not provided",
    51: "Session error / Session not provided",
    69: "Wrong credentials / Failed to log in",
    // I'm not entirely sure what this actually means, but it triggers when
    // reusing an existing session for some reason? Although, it only happens
    // for the first few seconds, and then everything is fine again? Is the 
    // backend out of sync by accident? Or is it a smule thing?
    2001: "Try refreshing the page, or log out and log in again."
}
export type MidiFile = {
    formatType: 0|1|2,
    timeDivision: number, // tempo
    tracks: number,
    track: Array<{
        event: Array<{
            data: string|number[],
            deltaTime: number,
            metaType: number,
            type: number
        }>
    }>
}
//#endregion
