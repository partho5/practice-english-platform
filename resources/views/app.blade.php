<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

{{--        <title inertia>{{ config('app.name', 'Laravel') }}</title>--}}
        <title>Find Your Speaking Partner</title>

        <meta name="description" content="Match English speakers at your level" />

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Find Your Speaking Partner" />
        <meta property="og:description" content="Find Your Perfect Speaking Partner Who Matches Your Level" />
        <meta property="og:image" content="https://practice-english.jovoc.com/images/lets-practice-english-daily.png" />
        <meta property="og:url" content="https://practice-english.jovoc.com/" />
        <meta property="og:site_name" content="Practice English" />
        <meta property="og:locale" content="en_US" />

        <!-- Optional Facebook Extras -->
        <meta property="fb:app_id" content="YOUR_FB_APP_ID" />
        <meta name="author" content="Find Speaking Partner Team" />


        <!-- OneSignal SDK -->
        <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>


        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
