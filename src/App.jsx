import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Fish, Compass, ChevronRight, ChevronLeft, Send, Loader2, AlertTriangle, Sparkles, Anchor, Waves, BookOpen, ArrowLeft, Check, X, Plus, MessageCircle, Settings, Accessibility, Tent, Search, Bell, Droplets, Sun, Calendar } from 'lucide-react';

// ============================================================
// DATA — WDFW Water Access Sites (from Boundaries.csv)
// 406 publicly-accessible, fishable sites across Washington.
// All have boat ramps, hand launches, or fishing platforms.
// ============================================================
const SITES_RAW = [{"id":"site-204","name":"Fourth of July Lake","county":"Lincoln","region":"Eastern","manager":"WDFW","lat":47.6634,"lng":-118.7132,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-206","name":"Jameson Lake","county":"Douglas","region":"Central","manager":"WDFW","lat":47.9257,"lng":-119.9705,"closure":"Seasonal Limited Access","openDates":"Year-round. Closed to vehicles November 1 - 4th Friday in April.","boatRamps":2,"handLaunches":2,"fishingPlatforms":0,"ramp_surface":"Concrete, Gravel","ada_parking":5,"ada_loading":false,"restrooms":7,"ada_restrooms":0,"camping":true,"notes":"Walk-in allowed when entrance gate is closed."},{"id":"site-220","name":"Weiss","county":"Pierce","region":"Northwest","manager":"WDFW","lat":46.9549,"lng":-122.3426,"closure":"Seasonal Limited Access","openDates":"Year-round. Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-235","name":"Whitestone Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.6007,"lng":-119.8607,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-239","name":"Aeneas Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.7098,"lng":-119.4806,"closure":"Seasonal Limited Access","openDates":"Year-round.  Closed to all vehicles November 1 - 4th Friday in April.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-242","name":"Lake Alice","county":"King","region":"Northwest","manager":"WDFW","lat":47.4766,"lng":-121.827,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-243","name":"Amber Lake","county":"Spokane","region":"Eastern","manager":"WDFW","lat":47.4877,"lng":-117.187,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-244","name":"American Lake","county":"Pierce","region":"Northwest","manager":"WDFW","lat":46.9612,"lng":-122.3737,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-246","name":"Lake Armstrong","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.0654,"lng":-121.6606,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-249","name":"Badger Lake","county":"Spokane","region":"Eastern","manager":"WDFW","lat":47.7205,"lng":-117.6855,"closure":"Seasonal Limited Access","openDates":"Year-round. Open to vehicles only during the regulated sport fishing and waterfowl season.","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":"ADA accessible fishing pier."},{"id":"site-250","name":"Barrier Dam","county":"Lewis","region":"Southwest","manager":"Tacoma Power","lat":46.6872,"lng":-122.5637,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":3,"ramp_surface":"Concrete","ada_parking":4,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"Managed by Tacoma Power."},{"id":"site-251","name":"Bass Lake","county":"King","region":"Northwest","manager":"WDFW","lat":47.4201,"lng":-121.5734,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-252","name":"Bay Lake","county":"Pierce","region":"Northwest","manager":"WDFW","lat":46.9242,"lng":-121.9649,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-255","name":"Beaver Lake","county":"King","region":"Northwest","manager":"WDFW","lat":47.2805,"lng":-121.5834,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-256","name":"Beaver Lake","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.7179,"lng":-121.8508,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-259","name":"Benson Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.1655,"lng":-123.1812,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-260","name":"Big Lake","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.3631,"lng":-121.7922,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-263","name":"Black Lake","county":"Stevens","region":"Eastern","manager":"WDFW","lat":48.199,"lng":-118.1484,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-264","name":"Black Lake","county":"Thurston","region":"Northwest","manager":"WDFW","lat":47.137,"lng":-122.5856,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-265","name":"Old Highway 9","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.2205,"lng":-123.9693,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-268","name":"Blue Creek","county":"Lewis","region":"Southwest","manager":"WDFW","lat":46.4753,"lng":-122.3506,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":0,"fishingPlatforms":3,"ramp_surface":"","ada_parking":4,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Cowlitz Trout Hatchery ADA fishing platforms. Managed by Tacoma Power. Adjacent to Tacoma Power's Blue Creek Boat Launch."},{"id":"site-269","name":"Blue Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":46.9916,"lng":-119.5021,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":true,"notes":""},{"id":"site-270","name":"Blue Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.6078,"lng":-119.8666,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-271","name":"Blue Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.6078,"lng":-119.8666,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-273","name":"Bonney Lake","county":"Pierce","region":"Northwest","manager":"City of Bonney Lake","lat":46.9244,"lng":-122.1279,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Managed by the City of Bonney Lake."},{"id":"site-275","name":"Boston Harbor","county":"Thurston","region":"Northwest","manager":"Thurston County","lat":47.1703,"lng":-122.7498,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Managed by Thurston County."},{"id":"site-276","name":"Bosworth Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.1832,"lng":-121.6876,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-280","name":"Buck Lake","county":"Kitsap","region":"Northwest","manager":"WDFW","lat":47.6644,"lng":-122.7357,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-283","name":"Cady Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.3509,"lng":-123.1172,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-284","name":"Cain Lake","county":"Whatcom","region":"Northwest","manager":"WDFW","lat":48.6802,"lng":-121.5365,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-287","name":"Lake Campbell","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.5684,"lng":-121.54,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":2,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-292","name":"Carney Lake","county":"Pierce","region":"Northwest","manager":"WDFW","lat":46.988,"lng":-122.0606,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-295","name":"Lake Cavanaugh","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.6116,"lng":-122.0136,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-296","name":"Cedar Lake","county":"Stevens","region":"Eastern","manager":"WDFW","lat":48.1577,"lng":-117.7571,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-298","name":"Chain Lake","county":"Pend Oreille","region":"Eastern","manager":"WDFW","lat":48.6821,"lng":-117.0598,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"No trailer parking"},{"id":"site-299","name":"Chain Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.0133,"lng":-121.5878,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-300","name":"Chambers Lake","county":"Thurston","region":"Northwest","manager":"Thurston County","lat":46.8136,"lng":-122.6607,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Managed by Thurston County in part as trailhead of the Chehalis-Western Trail."},{"id":"site-303","name":"Fuller Bridge","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.3647,"lng":-123.5992,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":true,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-309","name":"Clear Lake","county":"Pierce","region":"Northwest","manager":"WDFW","lat":47.2931,"lng":-122.1133,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-310","name":"Clear Lake","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.3859,"lng":-121.6981,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-311","name":"Clear Lake","county":"Spokane","region":"Eastern","manager":"WDFW","lat":47.5861,"lng":-117.3029,"closure":"Seasonal","openDates":"Open only during the regulated sport fishing and waterfowl seasons.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-312","name":"Clear Lake","county":"Thurston","region":"Northwest","manager":"WDFW","lat":46.9912,"lng":-122.6384,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":2,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-314","name":"Woodland Bar","county":"Cowlitz","region":"Southwest","manager":"WDFW","lat":46.2906,"lng":-122.5309,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-315","name":"Knappton","county":"Pacific","region":"Southwest","manager":"WDFW","lat":46.4316,"lng":-124.0103,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Underwater hazards may exist.  Very limited onsite parking."},{"id":"site-316","name":"Connor Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":47.8725,"lng":-121.9614,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Onsite parking not available."},{"id":"site-318","name":"Couse Creek","county":"Asotin","region":"Eastern","manager":"WDFW","lat":46.2058,"lng":-117.4505,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-319","name":"Cow Lake","county":"Adams","region":"Eastern","manager":"WDFW","lat":47.2086,"lng":-118.3458,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-322","name":"Olequa Crossing","county":"Cowlitz","region":"Southwest","manager":"WDFW","lat":46.089,"lng":-122.4226,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-330","name":"Crabapple Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.0848,"lng":-121.6294,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-331","name":"Crescent Lake","county":"Pierce","region":"Northwest","manager":"WDFW","lat":47.1553,"lng":-122.1353,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-332","name":"Crocker Lake","county":"Jefferson","region":"Northwest","manager":"WDFW","lat":47.8528,"lng":-123.7676,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-334","name":"Davis Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.5408,"lng":-119.8881,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-335","name":"Davis Lake","county":"Pend Oreille","region":"Eastern","manager":"WDFW","lat":48.657,"lng":-117.2553,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-337","name":"Hog Lake","county":"Spokane","region":"Eastern","manager":"WDFW","lat":47.7801,"lng":-117.4183,"closure":"Seasonal Limited Access","openDates":"Year-round. Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-338","name":"Deep Lake","county":"Stevens","region":"Eastern","manager":"WDFW","lat":48.607,"lng":-117.7374,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-340","name":"Deer Lake","county":"Island","region":"Northwest","manager":"South Whidbey Parks District","lat":47.9355,"lng":-122.5129,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Managed by South Whidbey Parks District."},{"id":"site-341","name":"Deer Lake","county":"Stevens","region":"Eastern","manager":"WDFW","lat":48.2568,"lng":-117.8947,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-343","name":"Lake Desire","county":"King","region":"Northwest","manager":"WDFW","lat":47.4263,"lng":-122.0881,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Gravel","ada_parking":4,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-344","name":"Diamond Lake","county":"Pend Oreille","region":"Eastern","manager":"WDFW","lat":48.7537,"lng":-117.3867,"closure":"Seasonal Limited Access","openDates":"Year-round. Closed to street-legal vehicles December 1 - March 31.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-346","name":"Lake Dolloff","county":"King","region":"Northwest","manager":"WDFW","lat":47.3741,"lng":-121.9123,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-348","name":"Drano Lake","county":"Skamania","region":"Southwest","manager":"Skamania County","lat":45.984,"lng":-121.7075,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"Managed by Skamania County."},{"id":"site-350","name":"Duportail","county":"Benton","region":"Central","manager":"WDFW","lat":46.394,"lng":-119.6765,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-351","name":"Echo Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":47.8833,"lng":-121.4101,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-353","name":"Egg Lake","county":"San Juan","region":"Northwest","manager":"WDFW","lat":48.5363,"lng":-123.2394,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":1,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-355","name":"Ell Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.6721,"lng":-119.8341,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":true,"notes":""},{"id":"site-357","name":"Eloika Lake","county":"Spokane","region":"Eastern","manager":"WDFW","lat":47.3869,"lng":-117.5698,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-362","name":"Lake Erie","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.5982,"lng":-121.4463,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-363","name":"Faber Ferry","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.5862,"lng":-121.9219,"closure":"No closure","openDates":"Year-round","boatRamps":2,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"A companion boat launch is on the opposite (south) side of the river at the end of Skagit Ridge Road. Very flood prone."},{"id":"site-365","name":"Failor Lake","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.1317,"lng":-123.638,"closure":"Seasonal Limited Access","openDates":"Year-round. Open to vehicles 4th Saturday in April - September 15.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-366","name":"Fan Lake","county":"Pend Oreille","region":"Eastern","manager":"WDFW","lat":48.5795,"lng":-117.2505,"closure":"Seasonal","openDates":"4th Saturday in April - September 30","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-367","name":"Lake Fazon","county":"Whatcom","region":"Northwest","manager":"WDFW","lat":48.6184,"lng":-121.7833,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-368","name":"Lake Fenwick","county":"King","region":"Northwest","manager":"City of Kent","lat":47.6743,"lng":-121.8403,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Managed by the City of Kent."},{"id":"site-369","name":"Fiorito Lake","county":"Kittitas","region":"Central","manager":"WDFW","lat":47.2323,"lng":-120.4159,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":2,"camping":false,"notes":""},{"id":"site-371","name":"Fish Lake","county":"King","region":"Northwest","manager":"WDFW","lat":47.319,"lng":-121.9552,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-372","name":"Fishtrap Lake","county":"Lincoln","region":"Eastern","manager":"WDFW","lat":47.6772,"lng":-118.3382,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-373","name":"Flowing Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":47.8427,"lng":-121.5309,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-378","name":"Gate","county":"Thurston","region":"Northwest","manager":"WDFW","lat":46.6924,"lng":-122.8194,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-380","name":"Lake Goss","county":"Island","region":"Northwest","manager":"South Whidbey Parks District","lat":48.2688,"lng":-122.3759,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Managed by South Whidbey Parks District."},{"id":"site-388","name":"Grimes Lake","county":"Douglas","region":"Central","manager":"WDFW","lat":47.503,"lng":-119.5202,"closure":"Seasonal","openDates":"June 1 - August 31","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"This access area is private property that is open for public use.  Please respect this property so this opportunity can continue."},{"id":"site-389","name":"Halterman's Hole","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.666,"lng":-119.7023,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-390","name":"Hamilton","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.3325,"lng":-121.7394,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-392","name":"Harts Lake","county":"Pierce","region":"Northwest","manager":"WDFW","lat":46.9947,"lng":-122.2869,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-393","name":"Hatch Lake","county":"Stevens","region":"Eastern","manager":"WDFW","lat":48.1767,"lng":-117.8547,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-394","name":"Haven Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.2482,"lng":-123.1627,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-395","name":"Heller Bar","county":"Asotin","region":"Eastern","manager":"WDFW","lat":45.9603,"lng":-117.1283,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":1,"camping":true,"notes":"See the [Heller Bar Access Area](https://arcg.is/15zvX5) story map to learn about the opportunities and benefits WDFW land management facilitates for the public, wildlife, and habitats."},{"id":"site-396","name":"Hicks Lake","county":"Thurston","region":"Northwest","manager":"WDFW","lat":46.6849,"lng":-122.7111,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-398","name":"Lake Holm","county":"King","region":"Northwest","manager":"WDFW","lat":47.3171,"lng":-121.7871,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-400","name":"E Fk Hoquiam","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.0148,"lng":-124.0855,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-401","name":"Horseshoe Lake","county":"Kitsap","region":"Northwest","manager":"WDFW","lat":47.4939,"lng":-122.3513,"closure":"Seasonal Limited Access","openDates":"Year-round. Open to vehicles 4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-402","name":"Horseshoe Lake","county":"Pend Oreille","region":"Eastern","manager":"WDFW","lat":48.646,"lng":-117.2421,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-403","name":"Lake Howard","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.256,"lng":-121.4321,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Parking area and restroom are across the street and one block north of the launch."},{"id":"site-404","name":"Hummel Lake","county":"San Juan","region":"Northwest","manager":"WDFW","lat":48.6041,"lng":-123.2899,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-406","name":"Humptulips Old 101","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":46.8868,"lng":-123.6063,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-407","name":"Reynvaan Bar","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":46.9627,"lng":-123.8126,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Gravel bar launch."},{"id":"site-408","name":"Thorberg","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.1514,"lng":-124.0525,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-409","name":"I-5 Bridge","county":"Lewis","region":"Southwest","manager":"WDFW","lat":46.6983,"lng":-122.3559,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-411","name":"Isabella Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.1025,"lng":-123.1807,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-412","name":"Island","county":"Cowlitz","region":"Southwest","manager":"PacifiCorp","lat":45.9644,"lng":-122.5607,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"Managed by PacifiCorp."},{"id":"site-413","name":"Island Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.2055,"lng":-123.2647,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-414","name":"Island Lake","county":"Pacific","region":"Southwest","manager":"WDFW","lat":46.5765,"lng":-123.5917,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-416","name":"Jackson Lake","county":"Pierce","region":"Northwest","manager":"WDFW","lat":46.9808,"lng":-122.1033,"closure":"Seasonal Limited Access","openDates":"Year-round. Open to vehicles 4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-417","name":"Jumpoff Joe Lake","county":"Stevens","region":"Eastern","manager":"WDFW","lat":48.4326,"lng":-117.7483,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-421","name":"Prichard","county":"Cowlitz","region":"Southwest","manager":"WDFW","lat":46.1912,"lng":-122.9564,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-422","name":"Hand","county":"Cowlitz","region":"Southwest","manager":"WDFW","lat":46.3425,"lng":-122.8441,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-423","name":"Lake Ketchum","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.0297,"lng":-121.8637,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-427","name":"Lake Killarney","county":"King","region":"Northwest","manager":"WDFW","lat":47.5033,"lng":-121.6732,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-428","name":"Kitsap Lake","county":"Kitsap","region":"Northwest","manager":"WDFW","lat":47.8558,"lng":-122.6608,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-429","name":"Kress Lake","county":"Cowlitz","region":"Southwest","manager":"WDFW","lat":46.0675,"lng":-122.6816,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":4,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-431","name":"Lake Cassidy","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.0145,"lng":-121.9336,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-433","name":"Devereaux Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.4993,"lng":-123.275,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-437","name":"Lake Kapowsin","county":"Pierce","region":"Northwest","manager":"WDFW","lat":47.0141,"lng":-122.2526,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-439","name":"Lake Saint Clair","county":"Thurston","region":"Northwest","manager":"WDFW","lat":47.0137,"lng":-122.6669,"closure":"No closure","openDates":"Year-round","boatRamps":2,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-441","name":"North Cove","county":"Snohomish","region":"Northwest","manager":"City of Lake Stevens","lat":48.106,"lng":-121.6982,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":4,"ada_loading":true,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"Managed by the City of Lake Stevens."},{"id":"site-442","name":"Kenmore","county":"King","region":"Northwest","manager":"City of Kenmore","lat":47.4825,"lng":-121.5551,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"Restrooms are maintained by the City of Kenmore."},{"id":"site-443","name":"Langlois Lake","county":"King","region":"Northwest","manager":"WDFW","lat":47.3361,"lng":-121.6079,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-444","name":"Lavender Lake","county":"Kittitas","region":"Central","manager":"WDFW","lat":47.003,"lng":-120.5276,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":2,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-445","name":"Lake Lawrence","county":"Thurston","region":"Northwest","manager":"WDFW","lat":47.0773,"lng":-122.5995,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-446","name":"Leland Lake","county":"Jefferson","region":"Northwest","manager":"Jefferson County Parks & Rec","lat":47.5933,"lng":-123.3974,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"A Discover Pass is not required.  Managed by Jefferson County Parks and Recreation under a cooperative agreement."},{"id":"site-448","name":"Cedar Creek","county":"Clark","region":"Southwest","manager":"PacifiCorp","lat":45.6196,"lng":-122.6686,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Managed by PacifiCorp."},{"id":"site-454","name":"Liberty Lake","county":"Spokane","region":"Eastern","manager":"WDFW","lat":47.4584,"lng":-117.2666,"closure":"Seasonal","openDates":"March 1 - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-455","name":"Lake Limerick","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.3251,"lng":-123.3989,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Use restricted to fishing, launching of boats for fishing, and/or parking of vehicles while fishing."},{"id":"site-457","name":"Littlerock","county":"Thurston","region":"Northwest","manager":"WDFW","lat":46.7439,"lng":-123.0977,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-458","name":"Lake Loma","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.0628,"lng":-121.805,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-459","name":"Lone Lake","county":"Island","region":"Northwest","manager":"South Whidbey Parks District","lat":48.0898,"lng":-122.6474,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Managed by South Whidbey Parks District."},{"id":"site-460","name":"Long Lake","county":"Kitsap","region":"Northwest","manager":"WDFW","lat":47.8538,"lng":-122.8997,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-461","name":"Long Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.4621,"lng":-119.8911,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":true,"notes":""},{"id":"site-462","name":"Long Lake","county":"Thurston","region":"Northwest","manager":"WDFW","lat":47.1783,"lng":-122.739,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":true,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"Boat boarding platform available."},{"id":"site-464","name":"Lost Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.4285,"lng":-123.3314,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-465","name":"Devil's Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":47.9709,"lng":-121.9972,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-466","name":"Maggie Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.1591,"lng":-123.3951,"closure":"Seasonal Limited Access","openDates":"Year-round. Open to vehicles 4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-467","name":"Lake Margaret","county":"King","region":"Northwest","manager":"WDFW","lat":47.6143,"lng":-121.7667,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-469","name":"Marshall Lake","county":"Pend Oreille","region":"Eastern","manager":"WDFW","lat":48.6741,"lng":-117.5515,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-470","name":"Martha Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.0588,"lng":-121.945,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-472","name":"Massey Bar","county":"Lewis","region":"Southwest","manager":"WDFW","lat":46.5108,"lng":-122.657,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-473","name":"Mattoon Lake","county":"Kittitas","region":"Central","manager":"WDFW","lat":46.9003,"lng":-120.8941,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":2,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-475","name":"McIntosh Lake","county":"Thurston","region":"Northwest","manager":"WDFW","lat":47.1514,"lng":-122.8726,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-476","name":"Lake McMurray","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.4561,"lng":-121.8986,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-479","name":"Lake Meridian","county":"King","region":"Northwest","manager":"WDFW","lat":47.4221,"lng":-121.9877,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-480","name":"McFarland","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.4446,"lng":-119.5154,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":"Located at the confluence of McFarland Creek and the Methow River."},{"id":"site-481","name":"Carlton Hole","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.772,"lng":-119.5954,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-483","name":"Swaram","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.4657,"lng":-119.689,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-484","name":"Bridge One","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.7814,"lng":-119.7765,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-485","name":"Mineral Lake","county":"Lewis","region":"Southwest","manager":"WDFW","lat":46.7841,"lng":-122.6608,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":true,"restrooms":4,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-487","name":"Misery Point","county":"Kitsap","region":"Northwest","manager":"WDFW","lat":47.5154,"lng":-122.7446,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Overflow parking located across the street."},{"id":"site-488","name":"Mission Lake","county":"Kitsap","region":"Northwest","manager":"WDFW","lat":47.8522,"lng":-122.6901,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-490","name":"Modrow Bridge","county":"Cowlitz","region":"Southwest","manager":"WDFW","lat":46.1803,"lng":-122.5393,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-492","name":"Lake Morton","county":"King","region":"Northwest","manager":"WDFW","lat":47.5518,"lng":-121.7676,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-494","name":"Munn Lake","county":"Thurston","region":"Northwest","manager":"WDFW","lat":46.7136,"lng":-122.7214,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-501","name":"Nahwatzel Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.4093,"lng":-123.224,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-502","name":"Highway 4","county":"Pacific","region":"Southwest","manager":"WDFW","lat":46.6394,"lng":-123.451,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":3,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"The public fishing easement on the right/north bank is on private property. It begins at the bridge and extends 3/4 mile downriver. Public use is restricted to a 25-foot strip of land bordering and extending along the river."},{"id":"site-503","name":"Old Naselle Bridge","county":"Pacific","region":"Southwest","manager":"WDFW","lat":46.6139,"lng":-123.8617,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Adjacent parking area owned and managed by Pacific County."},{"id":"site-506","name":"Newman Lake","county":"Spokane","region":"Eastern","manager":"WDFW","lat":47.6382,"lng":-117.3564,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-507","name":"Handicap Hole","county":"Thurston","region":"Northwest","manager":"WDFW","lat":47.0408,"lng":-122.6996,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-510","name":"De Groot","county":"Whatcom","region":"Northwest","manager":"WDFW","lat":48.8219,"lng":-121.8989,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":true,"restrooms":2,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-513","name":"Nugents Corner","county":"Whatcom","region":"Northwest","manager":"WDFW","lat":48.7269,"lng":-121.5442,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-514","name":"Ferndale","county":"Whatcom","region":"Northwest","manager":"Whatcom County Parks & Recreation Depatment","lat":49.0592,"lng":-121.8703,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Co-managed by Whatcom County."},{"id":"site-516","name":"North Lake","county":"King","region":"Northwest","manager":"WDFW","lat":47.5864,"lng":-122.0892,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-518","name":"Offutt Lake","county":"Thurston","region":"Northwest","manager":"WDFW","lat":46.9798,"lng":-123.1045,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-519","name":"Ohop Lake","county":"Pierce","region":"Northwest","manager":"WDFW","lat":47.213,"lng":-122.3304,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-520","name":"Riverside","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.7987,"lng":-119.5863,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"Access area also includes covered picnic area, standing BBQ grill, and walking path."},{"id":"site-522","name":"Palix River","county":"Pacific","region":"Southwest","manager":"WDFW","lat":46.3679,"lng":-123.9725,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-526","name":"Panther Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.197,"lng":-123.0855,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-527","name":"Panther Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":47.805,"lng":-121.7102,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-528","name":"Patterson Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.6801,"lng":-119.9144,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-529","name":"Pattison Lake","county":"Thurston","region":"Northwest","manager":"WDFW","lat":47.1509,"lng":-122.6112,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-531","name":"Pearrygin Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.7034,"lng":-119.6635,"closure":"Seasonal Limited Access","openDates":"Year-round.  Closed to all vehicles November 1 - 4th Friday in April.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-533","name":"Ruby Ferry","county":"Pend Oreille","region":"Eastern","manager":"WDFW","lat":48.5272,"lng":-117.259,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-540","name":"Phillips Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.3215,"lng":-123.0991,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-543","name":"Pleasant Harbor","county":"Jefferson","region":"Northwest","manager":"WDFW","lat":47.7136,"lng":-123.5303,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"See the [Pleasant Harbor Access Area](https://arcg.is/1y0uSr) story map to learn about the opportunities and benefits WDFW land management facilitates for the public, wildlife, and habitats."},{"id":"site-545","name":"Plummer Lake","county":"Lewis","region":"Southwest","manager":"City of Centralia","lat":46.361,"lng":-122.1004,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Managed by the City of Centralia."},{"id":"site-548","name":"Point Whitney","county":"Jefferson","region":"Northwest","manager":"WDFW","lat":47.9604,"lng":-123.261,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"The boat ramp is often covered with sand.  Four-wheel drive vehicles are recommended for launching boats.  Overnight parking or camping are prohibited.  The restroom is open from 7 a.m. to 7 p.m."},{"id":"site-550","name":"Porter Bridge","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.223,"lng":-123.5356,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-552","name":"Pressentin Ferry","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.6418,"lng":-121.5592,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Onsite parking not available."},{"id":"site-553","name":"Trails End Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.4436,"lng":-123.3654,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-558","name":"Rapjohn Lake","county":"Pierce","region":"Northwest","manager":"WDFW","lat":47.107,"lng":-122.4239,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-559","name":"Rat Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.4354,"lng":-119.6208,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-562","name":"Riley Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.1257,"lng":-121.5415,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-564","name":"Rock Lake","county":"Whitman","region":"Eastern","manager":"WDFW","lat":46.7682,"lng":-117.3699,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-566","name":"Lake Roesiger","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.277,"lng":-121.552,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-567","name":"Roses Lake","county":"Chelan","region":"Central","manager":"WDFW","lat":47.9856,"lng":-120.9483,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":2,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-569","name":"Rotary Lake","county":"Yakima","region":"Central","manager":"Yakima County","lat":46.223,"lng":-120.6879,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":0,"fishingPlatforms":2,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Managed by Yakima County."},{"id":"site-570","name":"Round Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.4099,"lng":-119.7576,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":2,"ada_restrooms":2,"camping":true,"notes":""},{"id":"site-571","name":"Rowland Lake","county":"Klickitat","region":"Southwest","manager":"WDFW","lat":45.7128,"lng":-120.5933,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-572","name":"Sacheen Lake","county":"Pend Oreille","region":"Eastern","manager":"WDFW","lat":48.7436,"lng":-117.2828,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-573","name":"Lake Samish","county":"Whatcom","region":"Northwest","manager":"WDFW","lat":48.6186,"lng":-121.4159,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":true,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"Boat inspections and permits are required for boaters using boat ramps at Lake Samish. For information, visit http://whatcomboatinspections.com/inspection-locations."},{"id":"site-580","name":"Tornow Branch","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.0767,"lng":-123.8559,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-582","name":"W Fk Satsop","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.3799,"lng":-124.0353,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-585","name":"Double Bridges","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.0641,"lng":-124.0544,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-589","name":"Sedro-Woolley","county":"Skagit","region":"Northwest","manager":"City of Sedro-Woolley","lat":48.6977,"lng":-121.7611,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Co-managed by the City of Sedro-Woolley."},{"id":"site-590","name":"Lake Serene","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.191,"lng":-121.7468,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Parking is located across the street from the launch."},{"id":"site-591","name":"Shadow Lake","county":"King","region":"Northwest","manager":"WDFW","lat":47.6306,"lng":-121.5318,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-592","name":"Shady Lake","county":"King","region":"Northwest","manager":"WDFW","lat":47.2762,"lng":-121.8069,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-594","name":"Lake Shoecraft","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.2753,"lng":-121.7665,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-595","name":"Sidley Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.4509,"lng":-119.6125,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-596","name":"Silver Lake","county":"Spokane","region":"Eastern","manager":"WDFW","lat":47.5117,"lng":-117.6136,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-597","name":"Silver Lake","county":"Whatcom","region":"Northwest","manager":"WDFW","lat":49.0868,"lng":-121.9344,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-599","name":"Sixteen Lake","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.2365,"lng":-121.5945,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-605","name":"Baker River","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.5334,"lng":-121.9028,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-606","name":"Edgewater Park","county":"Skagit","region":"Northwest","manager":"City of Mount Vernon","lat":48.6888,"lng":-121.6216,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Managed by the City of Mount Vernon."},{"id":"site-608","name":"Skokomish 101","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.3853,"lng":-123.3185,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-609","name":"Colonel's Hole","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.432,"lng":-122.9029,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-613","name":"Baehler","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":47.9274,"lng":-121.6605,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-616","name":"Lewis Street","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.1368,"lng":-121.5444,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-617","name":"Big Eddy","county":"Snohomish","region":"Northwest","manager":"State Parks","lat":48.1405,"lng":-121.5431,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Managed by Washington State Parks."},{"id":"site-619","name":"Ben Howard Hole","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.1315,"lng":-121.5985,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-626","name":"Plum","county":"King","region":"Northwest","manager":"WDFW","lat":47.5976,"lng":-122.0284,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"Additional parking and restroom are located 0.25 mile upstream at the intersection of SE Fish Hatchery Road and 372nd Ave SE. "},{"id":"site-627","name":"Raging River","county":"King","region":"Northwest","manager":"WDFW","lat":47.3709,"lng":-121.55,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-628","name":"Richter","county":"King","region":"Northwest","manager":"WDFW","lat":47.3754,"lng":-121.6395,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Additional parking located 1 mile to the south on Neal Road SE."},{"id":"site-632","name":"Hillstrom","county":"Clallam","region":"Northwest","manager":"WDFW","lat":47.8075,"lng":-123.8353,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-633","name":"Maxfield","county":"Clallam","region":"Northwest","manager":"WDFW","lat":48.0878,"lng":-124.1839,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-635","name":"Spectacle Lake E","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.6014,"lng":-119.4744,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-636","name":"Spectacle Lake W","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.3237,"lng":-119.6759,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-637","name":"Spencer Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.1915,"lng":-122.9495,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-639","name":"Sportsmans Lake","county":"San Juan","region":"Northwest","manager":"WDFW","lat":48.4669,"lng":-123.1706,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Limited onsite parking."},{"id":"site-641","name":"Spring Lake","county":"King","region":"Northwest","manager":"WDFW","lat":47.4309,"lng":-121.6151,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-642","name":"Spud House","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.4215,"lng":-121.8354,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-643","name":"Squalicum Lake","county":"Whatcom","region":"Northwest","manager":"WDFW","lat":48.9527,"lng":-121.824,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Walk-in only."},{"id":"site-645","name":"Steel Lake","county":"King","region":"Northwest","manager":"City of Federal Way","lat":47.6825,"lng":-122.0722,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Managed by the City of Federal Way."},{"id":"site-646","name":"Stickney Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.0364,"lng":-121.6015,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-650","name":"Hat Slough","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.27,"lng":-121.8639,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-656","name":"Lime Quarry","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":47.8548,"lng":-121.4621,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-657","name":"Storm Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":47.9859,"lng":-121.6425,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-660","name":"Summit Lake","county":"Thurston","region":"Northwest","manager":"WDFW","lat":47.1017,"lng":-122.5581,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":2,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-661","name":"Sunday Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":47.9701,"lng":-121.7619,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":1,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-662","name":"Lake Sutherland","county":"Clallam","region":"Northwest","manager":"WDFW","lat":47.941,"lng":-123.6793,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-664","name":"Tahuya Lake","county":"Kitsap","region":"Northwest","manager":"WDFW","lat":47.4446,"lng":-122.3928,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":2,"fishingPlatforms":0,"ramp_surface":"","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-666","name":"Tanwax Lake","county":"Pierce","region":"Northwest","manager":"WDFW","lat":47.0706,"lng":-122.4099,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-667","name":"Tarboo Lake","county":"Jefferson","region":"Northwest","manager":"WDFW","lat":47.9604,"lng":-123.6593,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-669","name":"Tee Lake","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.1738,"lng":-123.4235,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-670","name":"Thrall","county":"Kittitas","region":"Central","manager":"WDFW","lat":47.1175,"lng":-120.7599,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-671","name":"Tiger Lake","county":"Kitsap","region":"Northwest","manager":"WDFW","lat":47.6115,"lng":-122.8405,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-673","name":"Toad Lake","county":"Whatcom","region":"Northwest","manager":"WDFW","lat":48.9626,"lng":-121.5875,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-680","name":"Tower Bridge","county":"Cowlitz","region":"Southwest","manager":"WDFW","lat":46.2304,"lng":-122.7287,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-683","name":"Triton Cove","county":"Jefferson","region":"Northwest","manager":"WDFW","lat":47.5493,"lng":-123.6137,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-684","name":"Lake Number 12","county":"King","region":"Northwest","manager":"WDFW","lat":47.6148,"lng":-121.8307,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-685","name":"Twin Lakes","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.148,"lng":-123.2023,"closure":"Seasonal Limited Access","openDates":"Year-round. Open to vehicles 4th Saturday in April - October 31.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-686","name":"Twin Lakes","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.4161,"lng":-119.8662,"closure":"Seasonal Limited Access","openDates":"Year-round.  Closed to all vehicles December 1 - March 31.","boatRamps":2,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-687","name":"Vogler Lake","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.6203,"lng":-121.975,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-688","name":"Wagner Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.2512,"lng":-121.4304,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-689","name":"Waitts Lake","county":"Stevens","region":"Eastern","manager":"WDFW","lat":48.6055,"lng":-117.7182,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-690","name":"Walker Lake","county":"King","region":"Northwest","manager":"WDFW","lat":47.7193,"lng":-122.0884,"closure":"Seasonal Limited Access","openDates":"Year-round.  Open to vehicles only during the regulated sport fishing season(s).","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-692","name":"Wannacut Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.454,"lng":-119.6179,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-694","name":"Ward Lake","county":"Thurston","region":"Northwest","manager":"WDFW","lat":47.1558,"lng":-122.942,"closure":"Seasonal","openDates":"4th Saturday in April - September 30","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-695","name":"Warden Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.109,"lng":-119.5812,"closure":"Seasonal","openDates":"4th Saturday in April - September 30","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Unimproved Surface","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-698","name":"County Line","county":"Clark","region":"Southwest","manager":"WDFW","lat":45.5482,"lng":-122.6073,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-701","name":"Wiser Lake","county":"Whatcom","region":"Northwest","manager":"WDFW","lat":48.8193,"lng":-121.7483,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-704","name":"Lower Dryden","county":"Chelan","region":"Central","manager":"WDFW","lat":47.788,"lng":-120.796,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-706","name":"Fox Miller","county":"Chelan","region":"Central","manager":"WDFW","lat":47.8968,"lng":-120.7999,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-707","name":"Lower Monitor","county":"Chelan","region":"Central","manager":"WDFW","lat":47.8711,"lng":-120.5413,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-708","name":"Peshastin","county":"Chelan","region":"Central","manager":"WDFW","lat":47.9918,"lng":-120.6012,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-709","name":"Turkey Shoot","county":"Chelan","region":"Central","manager":"WDFW","lat":48.0487,"lng":-120.8441,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-711","name":"Dryden Dam","county":"Chelan","region":"Central","manager":"WDFW","lat":47.8852,"lng":-120.5315,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Boats can be hand launched below Dryden Dam."},{"id":"site-712","name":"West Medical Lake","county":"Spokane","region":"Eastern","manager":"WDFW","lat":47.4502,"lng":-117.391,"closure":"Seasonal","openDates":"4th Saturday in April - September 30","boatRamps":2,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":5,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-713","name":"Lake Whatcom","county":"Whatcom","region":"Northwest","manager":"WDFW","lat":49.0375,"lng":-121.6035,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"Boat inspections and permits are required for boaters using boat ramps at Lake Whatcom. For details, visit http://whatcomboatinspections.com/inspection-locations."},{"id":"site-717","name":"Lake Whitman","county":"Pierce","region":"Northwest","manager":"WDFW","lat":47.0271,"lng":-121.9509,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-719","name":"Wildcat Lake","county":"Kitsap","region":"Northwest","manager":"WDFW","lat":47.6225,"lng":-122.4971,"closure":"Seasonal","openDates":"4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-720","name":"Wilderness Lake","county":"King","region":"Northwest","manager":"City of Maple Valley","lat":47.6087,"lng":-121.8526,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Managed by the City of Maple Valley."},{"id":"site-724","name":"Ward Creek","county":"Pacific","region":"Southwest","manager":"WDFW","lat":46.7873,"lng":-123.918,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-727","name":"Williams Lake","county":"Spokane","region":"Eastern","manager":"WDFW","lat":47.7961,"lng":-117.4437,"closure":"Seasonal Limited Access","openDates":"Year-round. Open to vehicles only during the regulated sport fishing and waterfowl seasons.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-729","name":"Wishkah River","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.2773,"lng":-124.0979,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-730","name":"Long Swamp","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.008,"lng":-123.5226,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-732","name":"Lake Wooten","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.1334,"lng":-123.3785,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-733","name":"Wye Lake","county":"Kitsap","region":"Northwest","manager":"WDFW","lat":47.5151,"lng":-122.5016,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-735","name":"Black Creek","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.0536,"lng":-123.5316,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-736","name":"Old White Bridge","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":46.9875,"lng":-124.0057,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Site of former bridge crossing."},{"id":"site-737","name":"Kinghorn Slough","county":"Kittitas","region":"Central","manager":"WDFW","lat":46.9051,"lng":-120.794,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-739","name":"Granger","county":"Yakima","region":"Central","manager":"WDFW","lat":46.447,"lng":-120.9659,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-740","name":"Snively Road","county":"Benton","region":"Central","manager":"WDFW","lat":46.2105,"lng":-119.4782,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-741","name":"Hyde Road","county":"Benton","region":"Central","manager":"WDFW","lat":46.2468,"lng":-119.601,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1021","name":"Blue Lake N","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.4448,"lng":-120.0345,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1022","name":"Blue Lake S","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.504,"lng":-119.6552,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1024","name":"Gage Station","county":"Grant","region":"Eastern","manager":"WDFW","lat":46.9856,"lng":-119.3282,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1030","name":"Mile Post 10","county":"Kittitas","region":"Central","manager":"WDFW","lat":47.0032,"lng":-120.886,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1031","name":"Mile Post 8","county":"Kittitas","region":"Central","manager":"WDFW","lat":47.1551,"lng":-120.7799,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-1033","name":"Moses Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.1676,"lng":-119.6098,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1034","name":"Outlet","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.1857,"lng":-119.6235,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"","ada_parking":3,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-1036","name":"Rearing Pond","county":"Clallam","region":"Northwest","manager":"WDFW","lat":47.906,"lng":-123.8445,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Concrete","ada_parking":5,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1037","name":"Ringold Springs","county":"Franklin","region":"Eastern","manager":"WDFW","lat":46.716,"lng":-118.6383,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":true,"notes":"Camping is allowed, registration required, 3 day limit. See <a href=\"https://wdfw.wa.gov/sites/default/files/2021-08/30083_ringold_designated_use_areas.pdf\" rel=\"noopener\" target=\"_blank\">Ringold Designated Use Areas map</a> for more information."},{"id":"site-1038","name":"Salmon Hatchery","county":"Clallam","region":"Northwest","manager":"WDFW","lat":48.01,"lng":-123.8426,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":true,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-1039","name":"Shumaker Grade","county":"Asotin","region":"Eastern","manager":"WDFW","lat":46.3014,"lng":-117.3039,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":"Designated parking located one mile downriver."},{"id":"site-1042","name":"Teanaway Junction","county":"Kittitas","region":"Central","manager":"WDFW","lat":46.9324,"lng":-120.6183,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1043","name":"Tennant Lake","county":"Whatcom","region":"Northwest","manager":"WDFW","lat":48.8292,"lng":-121.6339,"closure":"No closure","openDates":"Year-round","boatRamps":2,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete, Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Access accommodates only small boats or hand launched watercraft.  Must navigate under low bridge."},{"id":"site-1044","name":"Thorp","county":"Kittitas","region":"Central","manager":"WDFW","lat":47.1243,"lng":-120.4241,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1047","name":"Vernita Bridge","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.2618,"lng":-119.2724,"closure":"No closure","openDates":"Year-round","boatRamps":2,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1051","name":"Wilson","county":"Clallam","region":"Northwest","manager":"WDFW","lat":47.8207,"lng":-123.8238,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1053","name":"Leyendecker","county":"Clallam","region":"Northwest","manager":"WDFW","lat":48.1149,"lng":-124.1431,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1058","name":"Boggan's","county":"Asotin","region":"Eastern","manager":"WDFW","lat":46.335,"lng":-117.219,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":4,"ada_restrooms":0,"camping":true,"notes":"Additional parking and access to the river are located on the left (north) bank below the bridge."},{"id":"site-1059","name":"Cougar Creek","county":"Asotin","region":"Eastern","manager":"WDFW","lat":45.9924,"lng":-116.9271,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1069","name":"Columbia Basin","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.015,"lng":-119.3122,"closure":"Seasonal","openDates":"April 1 - September 30","boatRamps":0,"handLaunches":0,"fishingPlatforms":3,"ramp_surface":"","ada_parking":3,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-1086","name":"Highway 10 Take-out","county":"Kittitas","region":"Central","manager":"WDFW","lat":46.9559,"lng":-120.6458,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Access area is for watercraft take-out only."},{"id":"site-1116","name":"Rosburg","county":"Wahkiakum","region":"Southwest","manager":"WDFW","lat":46.3221,"lng":-123.4283,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1141","name":"Gardiner","county":"Jefferson","region":"Northwest","manager":"Port of Port Townsend","lat":47.7998,"lng":-123.3406,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Managed by the Port of Port Townsend."},{"id":"site-1146","name":"Silver Lake","county":"Cowlitz","region":"Southwest","manager":"WDFW","lat":45.9805,"lng":-122.8644,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Concrete","ada_parking":4,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1217","name":"Lyman Ferry","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.6951,"lng":-121.9564,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1219","name":"Pekin Ferry","county":"Cowlitz","region":"Southwest","manager":"WDFW","lat":46.1835,"lng":-122.6635,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":5,"ada_loading":true,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1228","name":"Williams Lake","county":"Stevens","region":"Eastern","manager":"WDFW","lat":48.6071,"lng":-117.5977,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Winter fishery only."},{"id":"site-1232","name":"Lake Martha","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":47.8581,"lng":-121.7314,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1502","name":"Rocky Ford Hatchery","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.0409,"lng":-119.4511,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"","ada_parking":3,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":"Additional parking, restroom, and walk-in access to Rocky Creek are located downstream (south) of the fishing pier."},{"id":"site-1519","name":"Langsdorf Landing","county":"Clark","region":"Southwest","manager":"WDFW","lat":45.9161,"lng":-122.4363,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":4,"ada_loading":true,"restrooms":2,"ada_restrooms":2,"camping":false,"notes":""},{"id":"site-1520","name":"Deep River","county":"Wahkiakum","region":"Southwest","manager":"WDFW","lat":46.2659,"lng":-123.5396,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-1521","name":"Beda Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.3311,"lng":-119.4856,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1522","name":"Caliche Lakes","county":"Grant","region":"Eastern","manager":"WDFW","lat":46.9685,"lng":-119.3766,"closure":"Seasonal Limited Access","openDates":"Year-round. Closed to vehicles October 1 - 4th Friday in April.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":"Gate is open from 4th Saturday in April through end of September.  Gates typically opened at least one day prior to opening day of fishing, depending on conditions.  Walk-in allowed when gate is closed.  Call WDFW Region 2 Office for more information."},{"id":"site-1523","name":"Chehalis River - Oakville","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.1195,"lng":-123.8554,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1526","name":"Cutchie 1","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.4044,"lng":-119.7644,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1527","name":"Cutchie 2","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.4418,"lng":-119.9968,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1528","name":"Cutchie 3","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.3593,"lng":-119.9707,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1532","name":"Morley","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":46.9819,"lng":-123.565,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1533","name":"Sportsman's Club","county":"Cowlitz","region":"Southwest","manager":"WDFW","lat":46.0679,"lng":-122.7898,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1534","name":"Turkey Hole","county":"Klickitat","region":"Southwest","manager":"WDFW","lat":45.8508,"lng":-120.7291,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":true,"notes":"NOTICE !  Turkey Hole (RM 4.8) is the last WDFW-designated take-out above Lyle Falls. Hazardous river conditions and active tribal fishing downstream. This launch is for take-out only."},{"id":"site-1536","name":"Loomis Lake","county":"Pacific","region":"Southwest","manager":"WDFW","lat":46.7465,"lng":-123.5222,"closure":"Seasonal Limited Access","openDates":"Year-round. Open to vehicles 4th Saturday in April - October 31","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1537","name":"Loon Lake","county":"Stevens","region":"Eastern","manager":"WDFW","lat":48.4935,"lng":-117.9962,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1540","name":"Bendtsen","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.5449,"lng":-119.487,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1541","name":"Driscoll Island","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.3076,"lng":-119.9793,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1544","name":"Skagit Headquarters","county":"Skagit","region":"Northwest","manager":"WDFW","lat":48.7143,"lng":-121.8106,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-1546","name":"Fisherman's Loop","county":"Cowlitz","region":"Southwest","manager":"WDFW","lat":46.2649,"lng":-122.5875,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1547","name":"Sprague Lake","county":"Adams","region":"Eastern","manager":"WDFW","lat":47.227,"lng":-118.609,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":5,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1549","name":"Benton City","county":"Benton","region":"Central","manager":"City of Benton City","lat":46.2337,"lng":-119.4186,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Managed by the City of Benton City."},{"id":"site-1550","name":"Fitzsimmons","county":"Yakima","region":"Central","manager":"WDFW","lat":46.5704,"lng":-121.0029,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1551","name":"Mellis Road","county":"Yakima","region":"Central","manager":"WDFW","lat":46.2308,"lng":-120.7216,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":3,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1554","name":"Zillah Bridge","county":"Yakima","region":"Central","manager":"WDFW","lat":46.3615,"lng":-120.4659,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1556","name":"239 Drain","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.1516,"lng":-119.7123,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1557","name":"Alkali Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.0023,"lng":-119.1822,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":3,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1559","name":"Ankeny N","county":"Douglas","region":"Central","manager":"WDFW","lat":47.7349,"lng":-119.7205,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":"Fifteen designated campsites available.  Fire rings not available due to vandalism and theft."},{"id":"site-1560","name":"Ankeny S","county":"Douglas","region":"Central","manager":"WDFW","lat":47.5975,"lng":-119.4233,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1562","name":"Barker Canyon","county":"Douglas","region":"Central","manager":"WDFW","lat":47.6671,"lng":-119.799,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":true,"notes":"  "},{"id":"site-1566","name":"Beebe Springs","county":"Chelan","region":"Central","manager":"WDFW","lat":47.679,"lng":-120.7723,"closure":"Seasonal Limited Access","openDates":"Year-round. Closed to all vehicles December 1 - March 15.","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-1568","name":"Big Ditch","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":47.9767,"lng":-121.6364,"closure":"Seasonal Limited Access","openDates":"Year-round. Closed to vehicles April 15 - September 15.","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1569","name":"Billy Clapp Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.2344,"lng":-119.4645,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"The lake is a reservoir operated by the Bureau of Reclamation (https://www.usbr.gov/pn/hydromet/cbp/).  Water levels are highest during irrigation season.  The lake level drops about 30' starting in mid-October and is refilled starting in early- to mid-March."},{"id":"site-1571","name":"Blythe","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.2726,"lng":-119.4012,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1574","name":"Buckshot","county":"Grant","region":"Eastern","manager":"Grant County PUD","lat":46.9887,"lng":-119.3909,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":true,"notes":"Managed by Grant County Public Utility Distict."},{"id":"site-1575","name":"Buena Pond","county":"Yakima","region":"Central","manager":"WDFW","lat":46.3648,"lng":-120.4482,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1576","name":"Burke Lake S","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.0775,"lng":-119.7259,"closure":"Seasonal Limited Access","openDates":"Year-round. Closed to vehicles October 1 - February 28.","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":true,"notes":"Walk-in only from October through February."},{"id":"site-1577","name":"Burke Lake E","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.1169,"lng":-119.6297,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1578","name":"Burke Lake W","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.21,"lng":-119.3252,"closure":"Seasonal Limited Access","openDates":"Year-round. Closed to vehicles October 1 - February 28.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":"Walk-in only from October through February.  Located 1.5 miles from gate."},{"id":"site-1579","name":"Buzzard Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.7996,"lng":-119.6981,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1580","name":"Campbell Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.3027,"lng":-119.8614,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1583","name":"Clark Pond","county":"Franklin","region":"Eastern","manager":"WDFW","lat":46.6769,"lng":-119.0757,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1585","name":"Conners Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.4826,"lng":-119.9682,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1586","name":"Corral Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.1624,"lng":-119.2698,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1588","name":"Cougar Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.6585,"lng":-119.5532,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":2,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1589","name":"Crab Creek","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.2725,"lng":-119.5121,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":"Potholes Reservoir water levels are influenced by irrigation.  As a result, this primitive launch may be inaccessible during low water levels, which occur during summer and fall.  https://www.usbr.gov/pn/hydromet/cbp/"},{"id":"site-1591","name":"Crescent Lake","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":48.0663,"lng":-121.8839,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1593","name":"Davis Slough","county":"Snohomish","region":"Northwest","manager":"WDFW","lat":47.8979,"lng":-121.7202,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1596","name":"Dodson & Winchester","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.1732,"lng":-119.425,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":true,"notes":""},{"id":"site-1601","name":"Fish Lake E","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.759,"lng":-119.5821,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1604","name":"Evergreen Reservoir E","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.4139,"lng":-119.2613,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":true,"notes":""},{"id":"site-1605","name":"Evergreen Reservoir N","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.3895,"lng":-119.4843,"closure":"Seasonal Limited Access","openDates":"Year-round. Closed to vehicles October 1 - February 28.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":"Walk-in only from October through February.  Located 1.8 miles from gate.  "},{"id":"site-1606","name":"Evergreen Reservoir SW","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.0859,"lng":-119.3847,"closure":"Seasonal Limited Access","openDates":"Year-round. Closed to vehicles October 1 - February 28.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":"Walk-in only from October through February."},{"id":"site-1609","name":"Fedesco-Harris","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.0307,"lng":-119.3194,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":"Hazardous falls located approximately 2 miles downstream.  Portage necessary."},{"id":"site-1615","name":"Forde Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.5711,"lng":-119.844,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":true,"notes":""},{"id":"site-1616","name":"Frenchman Hills Wasteway","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.242,"lng":-119.2336,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1618","name":"Frenchman Hills Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.0565,"lng":-119.2796,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1627","name":"Green Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.4877,"lng":-119.7256,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1634","name":"Johns River","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.3569,"lng":-123.9808,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":true,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Boat loading platform is available."},{"id":"site-1638","name":"Lake Terrell","county":"Whatcom","region":"Northwest","manager":"WDFW","lat":48.9975,"lng":-121.9082,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":1,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1640","name":"Leidl","county":"Klickitat","region":"Southwest","manager":"WDFW","lat":46.0004,"lng":-120.9939,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1642","name":"Lenice Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.445,"lng":-119.392,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":3,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":"Walk-in only."},{"id":"site-1643","name":"Little Green Lake","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.3443,"lng":-119.5364,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1644","name":"Long Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.1084,"lng":-119.6171,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1645","name":"Lower Goose Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.1233,"lng":-119.1789,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1646","name":"Luhr's Landing","county":"Thurston","region":"Northwest","manager":"WDFW","lat":46.9745,"lng":-123.0493,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":true,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"Loading platform located at top of ramp."},{"id":"site-1647","name":"Lyle Lake","county":"Adams","region":"Eastern","manager":"WDFW","lat":46.9903,"lng":-118.4772,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1648","name":"Mabton Bridge","county":"Yakima","region":"Central","manager":"WDFW","lat":46.5755,"lng":-120.5662,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1650","name":"Martha Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.186,"lng":-119.3098,"closure":"Seasonal Limited Access","openDates":"Year-round. Closed to vehicles October 1 - 4th Friday in April.","boatRamps":0,"handLaunches":1,"fishingPlatforms":1,"ramp_surface":"","ada_parking":2,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":"Gate is open from 4th Saturday in April through end of September. Gates typically opened at least one day prior to opening day of fishing, depending on conditions. Walk-in allowed when gate is closed. Call WDFW Region 2 Office for more information. "},{"id":"site-1652","name":"Million Dollar Mile N","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.3403,"lng":-119.554,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1653","name":"Million Dollar Mile S","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.173,"lng":-119.213,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1655","name":"Mineral Springs","county":"Klickitat","region":"Southwest","manager":"WDFW","lat":46.0003,"lng":-120.5247,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1659","name":"Fish Lake W","county":"Okanogan","region":"Central","manager":"WDFW","lat":48.6937,"lng":-119.5084,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1662","name":"Osborn Bay Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.4364,"lng":-119.463,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1669","name":"Ponds 4 & 5","county":"Yakima","region":"Central","manager":"WDFW","lat":46.3693,"lng":-120.8647,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":1,"ramp_surface":"","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1673","name":"Quincy Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.4257,"lng":-119.3318,"closure":"Seasonal Limited Access","openDates":"Year-round.  Closed to vehicles October 1 - February 28.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":"Walk-in only from October through February."},{"id":"site-1681","name":"Sam Israel","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.4329,"lng":-119.3574,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1686","name":"Smith Creek","county":"Pacific","region":"Southwest","manager":"WDFW","lat":46.3535,"lng":-123.9324,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1688","name":"Snyder Bar","county":"Asotin","region":"Eastern","manager":"WDFW","lat":46.183,"lng":-117.0545,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1689","name":"South Montesano Bridge","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.036,"lng":-123.5714,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":true,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"Use caution when launching at low tide."},{"id":"site-1696","name":"Stan Coffin Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.3087,"lng":-119.6752,"closure":"Seasonal Limited Access","openDates":"Year-round. Closed to vehicles October 1 - February 28.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Walk-in only from October through February."},{"id":"site-1697","name":"Stimpson Flats","county":"Klickitat","region":"Southwest","manager":"WDFW","lat":46.0096,"lng":-120.8124,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1700","name":"Sunland Estates","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.262,"lng":-119.5618,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":3,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1703","name":"Tim Ponds","county":"Yakima","region":"Central","manager":"WDFW","lat":46.2873,"lng":-120.4601,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":0,"fishingPlatforms":7,"ramp_surface":"","ada_parking":2,"ada_loading":false,"restrooms":2,"ada_restrooms":2,"camping":true,"notes":""},{"id":"site-1705","name":"Union River","county":"Mason","region":"Northwest","manager":"WDFW","lat":47.5931,"lng":-123.0516,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1707","name":"Upper Goose Lake","county":"Grant","region":"Eastern","manager":"WDFW","lat":46.9692,"lng":-119.3537,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1708","name":"Vancouver Lake","county":"Clark","region":"Southwest","manager":"WDFW","lat":45.8838,"lng":-122.715,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1713","name":"Winchester Lake 1","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.0493,"lng":-119.2808,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1714","name":"Winchester Lake 2","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.2128,"lng":-119.6701,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1715","name":"Winchester Lake 3","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.2041,"lng":-119.2419,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":true,"notes":""},{"id":"site-1717","name":"Yoyo Rock","county":"Chelan","region":"Central","manager":"WDFW","lat":47.8355,"lng":-120.719,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":true,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":""},{"id":"site-1724","name":"Frank Faha","county":"Asotin","region":"Eastern","manager":"WDFW","lat":46.3377,"lng":-117.1663,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":2,"ada_restrooms":2,"camping":true,"notes":""},{"id":"site-1729","name":"Lind Coulee Bridge","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.0316,"lng":-119.3691,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":4,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1730","name":"Lind Coulee East","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.4513,"lng":-119.2292,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":2,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1731","name":"Lind Coulee Point","county":"Grant","region":"Eastern","manager":"WDFW","lat":46.9651,"lng":-119.7332,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1732","name":"Lind Coulee Island","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.4025,"lng":-119.2723,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1733","name":"Glen Williams","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.0736,"lng":-119.1982,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":2,"ada_loading":false,"restrooms":3,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1734","name":"Medicare Beach","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.0867,"lng":-119.4056,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1735","name":"Sampson's Pit","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.09,"lng":-119.6633,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1736","name":"Warden Outfall","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.1551,"lng":-119.5905,"closure":"Seasonal Limited Access","openDates":"Year-round.  Closed to vehicles October 1 - December 31. ","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1738","name":"Mesa Lake","county":"Franklin","region":"Eastern","manager":"WDFW","lat":46.3117,"lng":-119.0396,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1770","name":"Kettle River","county":"Ferry","region":"Eastern","manager":"WDFW","lat":48.2252,"lng":-118.4478,"closure":"Seasonal Limited Access","openDates":"Year-round. Closed to all vehicles December 1 - March 31.","boatRamps":0,"handLaunches":1,"fishingPlatforms":0,"ramp_surface":"","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":1,"camping":false,"notes":"Hunting restricted to short-range methods (archery, muzzleloader, shotgun)."},{"id":"site-1771","name":"Bridgeport Bar","county":"Douglas","region":"Central","manager":"WDFW","lat":47.804,"lng":-119.5406,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1772","name":"Evergreen Reservoir W","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.0213,"lng":-119.5835,"closure":"Seasonal Limited Access","openDates":"Year-round. Closed to vehicles October 1 - February 28.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":1,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":true,"notes":"Walk-in only from October through February.  "},{"id":"site-1773","name":"Road C & Frenchman","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.0661,"lng":-119.5784,"closure":"No closure","openDates":"Year-round","boatRamps":0,"handLaunches":3,"fishingPlatforms":0,"ramp_surface":"","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1774","name":"South Bend","county":"Pacific","region":"Southwest","manager":"City of South Bend","lat":46.6217,"lng":-123.7037,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":4,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Managed by the City of South Bend."},{"id":"site-1775","name":"Windmill-Canal-Heart Lakes","county":"Grant","region":"Eastern","manager":"WDFW","lat":47.2936,"lng":-119.2292,"closure":"No closure","openDates":"Year-round","boatRamps":3,"handLaunches":1,"fishingPlatforms":3,"ramp_surface":"Concrete","ada_parking":4,"ada_loading":false,"restrooms":2,"ada_restrooms":0,"camping":true,"notes":""},{"id":"site-1782","name":"7400 Road","county":"Grays Harbor","region":"Southwest","manager":"WDFW","lat":47.0405,"lng":-123.8479,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Unimproved Surface","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Use limited to public vehicular access to the Wynoochee River for recreational fishing and boating."},{"id":"site-1783","name":"Lake Geneva","county":"King","region":"Northwest","manager":"WDFW","lat":47.4934,"lng":-121.9918,"closure":"No closure","openDates":"Year-round.","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":1,"ada_restrooms":0,"camping":false,"notes":"Onsite parking not available. Parking and restroom are located across the street at Lake Killarney Access Area."},{"id":"site-1784","name":"Swofford Pond","county":"Lewis","region":"Southwest","manager":"WDFW","lat":46.7672,"lng":-122.344,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Gravel","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":""},{"id":"site-1822","name":"Sekiu","county":"Clallam","region":"Northwest","manager":"WDFW","lat":47.9303,"lng":-123.7138,"closure":"No closure","openDates":"Year-round","boatRamps":1,"handLaunches":0,"fishingPlatforms":0,"ramp_surface":"Concrete","ada_parking":0,"ada_loading":false,"restrooms":0,"ada_restrooms":0,"camping":false,"notes":"Parking for boat trailers is limited."}];

// ============================================================
// CURATED METADATA — species, regs, stocking for well-known sites
// In production, would come from WDFW APIs / weekly stocking reports.
// ============================================================
const SITE_METADATA = {
  // Lowland trout lakes — most stocked in spring
  'Fourth of July Lake':   { species: ['Rainbow Trout', 'Cutthroat Trout'], type: 'lake', stocked: 'Mar 2026', opening: 'Year-round selective gear' },
  'Jameson Lake':          { species: ['Rainbow Trout', 'Tiger Trout', 'Brown Trout'], type: 'lake', stocked: 'Apr 14, 2026', opening: 'Apr 25 — opening day' },
  'Whitestone Lake':       { species: ['Rainbow Trout', 'Largemouth Bass'], type: 'lake', stocked: 'Apr 8, 2026' },
  'Aeneas Lake':           { species: ['Rainbow Trout'], type: 'lake', stocked: 'Apr 1, 2026', opening: 'Apr 25 — opening day' },
  'Cain Lake':             { species: ['Rainbow Trout', 'Kokanee', 'Largemouth Bass'], type: 'lake', stocked: 'Mar 30, 2026' },
  'Lake Alice':            { species: ['Rainbow Trout', 'Kokanee'], type: 'lake', stocked: 'Apr 5, 2026' },
  'Lake Kapowsin':         { species: ['Largemouth Bass', 'Rainbow Trout', 'Yellow Perch'], type: 'lake' },
  'Liberty Lake':          { species: ['Rainbow Trout', 'Largemouth Bass', 'Yellow Perch'], type: 'lake', stocked: 'Apr 10, 2026' },
  'Williams Lake':         { species: ['Rainbow Trout', 'Brown Trout'], type: 'lake', stocked: 'Apr 12, 2026' },
  'Campbell Lake':         { species: ['Rainbow Trout', 'Largemouth Bass'], type: 'lake', stocked: 'Mar 28, 2026' },
  'Devil\'s Lake':         { species: ['Rainbow Trout', 'Cutthroat Trout'], type: 'lake', stocked: 'Apr 2, 2026' },
  'Lake Wooten':           { species: ['Rainbow Trout', 'Kokanee'], type: 'lake' },
  'Tee Lake':              { species: ['Rainbow Trout', 'Cutthroat Trout'], type: 'lake' },
  'Panther Lake':          { species: ['Rainbow Trout', 'Largemouth Bass'], type: 'lake' },
  'Rat Lake':              { species: ['Rainbow Trout'], type: 'lake', stocked: 'Apr 7, 2026' },
  'Twin Lakes':            { species: ['Rainbow Trout'], type: 'lake', opening: 'Apr 25 — opening day' },
  'Hillstrom':             { species: ['Cutthroat Trout', 'Salmon (Coho)'], type: 'access' },
  'Barrier Dam':           { species: ['Steelhead', 'Salmon (Chinook)', 'Salmon (Coho)'], type: 'river' },
  'Pleasant Harbor':       { species: ['Lingcod', 'Rockfish', 'Salmon'], type: 'saltwater' },
  'Bridgeport Bar':        { species: ['Walleye', 'Smallmouth Bass'], type: 'reservoir' },
  'Windmill-Canal-Heart Lakes': { species: ['Rainbow Trout', 'Largemouth Bass', 'Bluegill'], type: 'lake', stocked: 'Apr 3, 2026' },
  'Sportsman\'s Club':     { species: ['Steelhead', 'Salmon (Coho)'], type: 'river' },
  'Ringold Springs':       { species: ['Rainbow Trout', 'Steelhead'], type: 'river', stocked: 'Apr 9, 2026' },
  'Ruby Ferry':            { species: ['Rainbow Trout', 'Kokanee'], type: 'lake' },
  'Weiss':                 { species: ['Rainbow Trout', 'Cutthroat Trout'], type: 'lake' },
};

// Heuristic for sites without explicit metadata: infer from name
function inferMetadata(name, county) {
  const n = name.toLowerCase();
  if (n.includes('lake') || n.includes('pond')) {
    return { species: ['Rainbow Trout', 'Largemouth Bass'], type: 'lake' };
  }
  if (n.includes('river') || n.includes('creek') || n.includes('fork') || n.includes('dam')) {
    return { species: ['Steelhead', 'Trout', 'Salmon'], type: 'river' };
  }
  if (n.includes('bay') || n.includes('harbor') || n.includes('cove') || n.includes('sound')) {
    return { species: ['Salmon', 'Lingcod', 'Rockfish'], type: 'saltwater' };
  }
  if (n.includes('reservoir') || n.includes('bar')) {
    return { species: ['Walleye', 'Bass', 'Rainbow Trout'], type: 'reservoir' };
  }
  return { species: ['Trout', 'Bass'], type: 'access' };
}

function enrichSite(site) {
  const meta = SITE_METADATA[site.name] || inferMetadata(site.name, site.county);
  return { ...site, ...meta, isCurated: !!SITE_METADATA[site.name] };
}

const SITES = SITES_RAW.map(enrichSite);

// ============================================================
// STOCKING UPDATES — top recent stocking activity for the alert feed
// Modeled on WDFW's weekly trout stocking reports
// ============================================================
const STOCKING_UPDATES = [
  { date: 'Apr 14, 2026', site: 'Jameson Lake', detail: '8,500 catchable Rainbow Trout', tag: 'stocked' },
  { date: 'Apr 12, 2026', site: 'Williams Lake', detail: '4,200 Rainbow + 800 Brown Trout', tag: 'stocked' },
  { date: 'Apr 10, 2026', site: 'Liberty Lake', detail: '6,000 catchable Rainbow Trout', tag: 'stocked' },
  { date: 'Apr 9, 2026',  site: 'Ringold Springs', detail: '3,500 Rainbow Trout', tag: 'stocked' },
  { date: 'Apr 8, 2026',  site: 'Whitestone Lake', detail: '5,200 catchable Rainbow Trout', tag: 'stocked' },
  { date: 'Apr 25, 2026', site: 'Statewide Lowland Lakes', detail: 'Opening Day — many waters open to fishing', tag: 'opening' },
];

// ============================================================
// STORAGE
// ============================================================
const PROFILE_KEY = 'castwise:profile';
const TRIP_KEY = 'castwise:trip';

async function loadProfile() {
  try {
    const r = await window.storage.get(PROFILE_KEY);
    if (!r) return null;
    const p = JSON.parse(r.value);
    // Validate shape — discard if any required field is missing or malformed.
    if (!p || typeof p.experience !== 'string' || !Array.isArray(p.accessType) ||
        !Array.isArray(p.fishingTypes) || !Array.isArray(p.gear) ||
        typeof p.location !== 'string' || typeof p.travel !== 'string') {
      await window.storage.delete(PROFILE_KEY);
      return null;
    }
    return p;
  } catch { return null; }
}
async function saveProfile(p) {
  try { await window.storage.set(PROFILE_KEY, JSON.stringify(p)); } catch (e) { console.error(e); }
}
async function loadTrip() {
  try {
    const r = await window.storage.get(TRIP_KEY);
    if (!r) return null;
    const t = JSON.parse(r.value);
    // Guard: ensure trip has the expected shape. Older versions of this
    // app stored { waterway: ... } instead of { site: ... }; discard those.
    if (!t || !t.site || typeof t.site.name !== 'string') {
      await window.storage.delete(TRIP_KEY);
      return null;
    }
    return t;
  } catch { return null; }
}
async function saveTrip(t) {
  try {
    if (t === null) await window.storage.delete(TRIP_KEY);
    else await window.storage.set(TRIP_KEY, JSON.stringify(t));
  } catch (e) { console.error(e); }
}

// ============================================================
// CLAUDE API
// ============================================================
async function askClaude(messages, system) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system,
      messages
    })
  });
  if (!response.ok) throw new Error('API error');
  const data = await response.json();
  return data.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
}

function buildSystemPrompt(profile, site) {
  const stocking = site.stocked ? `Recently stocked: ${site.stocked}.` : 'No recent stocking on record.';
  const opening = site.opening ? `Opening info: ${site.opening}.` : '';
  return `You are CastWise, a knowledgeable Washington fishing assistant working with the Washington Department of Fish and Wildlife (WDFW). You speak plainly and practically, like a seasoned angler giving advice — warm but no-nonsense.

ANGLER PROFILE:
- Experience: ${profile.experience}
- Frequency: ${profile.frequency}
- Home region: ${profile.location} Washington
- Travel preference: ${profile.travel === 'local' ? 'prefers local waters' : 'willing to travel'}
- Access preference: ${profile.accessType.join(' and ')}
- Interested in: ${profile.fishingTypes.join(', ')}
- Owned gear: ${profile.gear.length ? profile.gear.join(', ') : 'none specified'}

PLANNED TRIP — ${site.name} (${site.county} County, ${site.region} Washington):
- Managed by: ${site.manager}
- Waterbody type: ${site.type}
- Likely species: ${site.species.join(', ')}
- Access infrastructure: ${site.boatRamps} boat ramp(s), ${site.handLaunches} hand launch(es), ${site.fishingPlatforms} fishing platform(s)${site.ada_parking > 0 ? `, ${site.ada_parking} ADA parking stalls` : ''}${site.ada_loading ? ', ADA loading platform' : ''}
- Closure status: ${site.closure}${site.openDates ? ` (${site.openDates})` : ''}
- ${stocking} ${opening}
${site.notes ? `- Site notes: ${site.notes}` : ''}

When the user first asks for trip prep, give: (1) gear-specific recommendations tailored to their owned gear and experience level — call out gear they're missing if relevant, (2) a clear ALERT about any closure, opening date, or recent stocking that affects this trip, (3) 2-3 practical tactics for the listed species. Keep it scannable — short sections, no walls of text. Use plain markdown (## for headers, ** for bold, - for lists). Start ALERT lines with the word ALERT so the app can format them. For follow-up questions, answer directly and concisely. Always remind the user to verify current rules at wdfw.wa.gov before fishing.`;
}

// ============================================================
// MAIN APP
// ============================================================
export default function CastWise() {
  const [screen, setScreen] = useState('loading');
  const [profile, setProfile] = useState(null);
  const [trip, setTrip] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    (async () => {
      const p = await loadProfile();
      const t = await loadTrip();
      if (p) setProfile(p);
      if (t) setTrip(t);
      setScreen(p ? 'map' : 'welcome');
    })();
  }, []);

  const handleProfileComplete = async (p) => {
    await saveProfile(p);
    setProfile(p);
    setScreen('map');
  };

  const handleSelectSite = (s) => {
    setSelectedSite(s);
    setScreen('site');
  };

  const handleAddToTrip = async (s) => {
    const t = { site: s, createdAt: Date.now() };
    await saveTrip(t);
    setTrip(t);
    setScreen('trip');
  };

  const handleReset = async () => {
    try { await window.storage.delete(PROFILE_KEY); } catch {}
    try { await window.storage.delete(TRIP_KEY); } catch {}
    setProfile(null);
    setTrip(null);
    setScreen('welcome');
  };

  return (
    <div className="cw-stage">
      <style>{styles}</style>
      <DecorBackground/>
      <BrandHeader/>
      <SideStats trip={trip}/>
      <div className="cw-phone">
        <div className="cw-phone-notch"/>
        <div className="cw-phone-screen">
          {screen === 'loading' && <LoadingScreen/>}
          {screen === 'welcome' && <Welcome onStart={() => setScreen('intake')}/>}
          {screen === 'intake' && <Intake onComplete={handleProfileComplete}/>}
          {screen === 'map' && profile && (
            <MapView
              profile={profile}
              trip={trip}
              onSelect={handleSelectSite}
              onViewTrip={() => setScreen('trip')}
              onReset={handleReset}
            />
          )}
          {screen === 'site' && selectedSite && (
            <SiteProfile
              site={selectedSite}
              inTrip={trip && trip.site.id === selectedSite.id}
              onBack={() => setScreen('map')}
              onAdd={() => handleAddToTrip(selectedSite)}
            />
          )}
          {screen === 'trip' && trip && profile && (
            <TripView
              profile={profile}
              trip={trip}
              onBack={() => setScreen('map')}
              onRemove={async () => { await saveTrip(null); setTrip(null); setScreen('map'); }}
            />
          )}
        </div>
        <div className="cw-phone-bar"/>
      </div>
      <FooterRibbon/>
    </div>
  );
}

// ============================================================
// DECOR — green background, fish silhouettes, trees, wave rings
// ============================================================
function DecorBackground() {
  return (
    <>
      <svg className="cw-decor-trees" viewBox="0 0 1400 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <path id="conifer" d="M0,-90 L-30,-30 L-12,-30 L-36,10 L-12,10 L-42,50 L42,50 L12,10 L36,10 L12,-30 L30,-30 Z"/>
        </defs>
        {[...Array(14)].map((_, i) => {
          const x = 60 + i * 100 + (i % 2 === 0 ? 20 : -10);
          const y = 280 + (i % 3) * 8;
          const scale = 0.7 + (i % 4) * 0.18;
          return <use key={i} href="#conifer"
                   transform={`translate(${x},${y}) scale(${scale})`}
                   fill="currentColor" opacity={0.35 + (i % 3) * 0.08}/>;
        })}
      </svg>

      <svg className="cw-decor-rings" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {[280, 360, 460, 580, 720].map((r, i) => (
          <circle key={i} cx="600" cy="400" r={r} fill="none" stroke="currentColor"
                  strokeWidth="1" strokeDasharray="2 6" opacity={0.4 - i * 0.05}/>
        ))}
      </svg>

      {/* Scattered fishing icons around the phone */}
      <div className="cw-decor-icons" aria-hidden="true">
        <FishIcon className="ic ic-1"/>
        <RodIcon className="ic ic-2"/>
        <BoatIcon className="ic ic-3"/>
        <HookIcon className="ic ic-4"/>
        <FishIcon className="ic ic-5"/>
        <TackleIcon className="ic ic-6"/>
        <WaveIcon className="ic ic-7"/>
        <FishIcon className="ic ic-8"/>
      </div>
    </>
  );
}

function FishIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 60 32" fill="currentColor">
      <path d="M5,16 Q12,4 28,4 Q44,4 50,16 Q44,28 28,28 Q12,28 5,16 Z M50,16 L58,8 L58,24 Z M22,14 A1.5,1.5 0 1,1 22,17 Z"/>
      <path d="M30,8 Q35,16 30,24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    </svg>
  );
}
function RodIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="52" x2="52" y2="8"/>
      <circle cx="14" cy="48" r="4" fill="currentColor"/>
      <path d="M50,10 L48,18 L42,16 L40,24 L34,20" strokeWidth="1.2"/>
    </svg>
  );
}
function BoatIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 60 40" fill="currentColor">
      <path d="M4,26 L56,26 L48,38 L12,38 Z"/>
      <line x1="30" y1="26" x2="30" y2="6" stroke="currentColor" strokeWidth="2"/>
      <path d="M30,8 L46,22 L30,22 Z"/>
    </svg>
  );
}
function HookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20,4 L20,30 Q20,46 12,46 Q4,46 4,38" strokeLinecap="round"/>
      <line x1="20" y1="4" x2="20" y2="8" strokeWidth="4"/>
    </svg>
  );
}
function TackleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 50 40" fill="currentColor">
      <rect x="4" y="14" width="42" height="22" rx="2"/>
      <rect x="14" y="10" width="22" height="6" rx="1"/>
      <line x1="4" y1="24" x2="46" y2="24" stroke="var(--green-deep)" strokeWidth="1"/>
    </svg>
  );
}
function WaveIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 60 30" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2,15 Q10,5 20,15 T38,15 T58,15"/>
      <path d="M2,22 Q10,12 20,22 T38,22 T58,22" opacity="0.5"/>
    </svg>
  );
}

function BrandHeader() {
  return (
    <div className="cw-brand-header">
      <div className="cw-brand-pill">
        <span className="cw-brand-pill-mark">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M3,12 Q7,4 13,4 Q20,4 22,12 Q20,20 13,20 Q7,20 3,12 Z M22,12 L19,9 L19,15 Z" fill="var(--green-deep)"/><circle cx="9" cy="11" r="0.9" fill="var(--gold)"/></svg>
        </span>
        <span className="cw-brand-pill-text">cast<em>wise</em></span>
      </div>
      <div className="cw-brand-tag">WDFW field companion · est. 2026</div>
    </div>
  );
}

function FooterRibbon() {
  return (
    <div className="cw-footer-ribbon">
      <span>Washington Department of Fish & Wildlife</span>
      <span className="dot"/>
      <span>Public access waters only</span>
      <span className="dot"/>
      <span>406 sites statewide</span>
    </div>
  );
}

// ============================================================
// SIDE STATS PANEL — shown when a trip exists
// ============================================================
function SideStats({ trip }) {
  if (!trip) return null;
  const s = trip.site;
  return (
    <div className="cw-side-card">
      <div className="cw-side-title">Trip planned</div>
      <div className="cw-side-divider"/>
      <div className="cw-side-name">{s.name}</div>
      <div className="cw-side-meta">{s.county} Co. · {s.region}</div>
      <div className="cw-side-grid">
        <div><div className="cw-side-num">{s.boatRamps}</div><div className="cw-side-lbl">Boat ramps</div></div>
        <div><div className="cw-side-num">{s.handLaunches}</div><div className="cw-side-lbl">Hand launches</div></div>
        <div><div className="cw-side-num">{s.fishingPlatforms}</div><div className="cw-side-lbl">Platforms</div></div>
        <div><div className="cw-side-num">{s.restrooms}</div><div className="cw-side-lbl">Restrooms</div></div>
      </div>
      {s.stocked && (
        <div className="cw-side-pill">
          <Droplets size={11}/> Stocked {s.stocked}
        </div>
      )}
    </div>
  );
}

// ============================================================
// LOADING
// ============================================================
function LoadingScreen() {
  return (
    <div className="cw-loading">
      <Waves size={28} className="cw-spin-slow"/>
      <span>Casting line…</span>
    </div>
  );
}

// ============================================================
// WELCOME
// ============================================================
function Welcome({ onStart }) {
  return (
    <div className="cw-screen cw-welcome">
      <div className="cw-welcome-emblem">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="var(--green-deep)" stroke="var(--gold)" strokeWidth="1.5"/>
          <circle cx="50" cy="50" r="38" fill="none" stroke="var(--cream)" strokeWidth="0.5" opacity="0.5"/>
          <path d="M18,55 Q28,46 38,55 T58,55 T82,55" fill="none" stroke="var(--gold)" strokeWidth="2"/>
          <path d="M18,62 Q28,53 38,62 T58,62 T82,62" fill="none" stroke="var(--cream)" strokeWidth="1.2" opacity="0.6"/>
          <text x="50" y="26" textAnchor="middle" fontSize="6" letterSpacing="3" fill="var(--gold)" fontFamily="serif">EST · WDFW</text>
          <text x="50" y="84" textAnchor="middle" fontSize="5.5" letterSpacing="2" fill="var(--cream)" opacity="0.7" fontFamily="serif">WASHINGTON</text>
        </svg>
      </div>
      <h1 className="cw-welcome-title">Cast<em>Wise</em></h1>
      <div className="cw-welcome-rule"><span/></div>
      <p className="cw-welcome-tag">A field companion for Washington anglers.</p>
      <p className="cw-welcome-body">
        Tell us how you fish and we'll point you to public access waters across the state, with tailored gear advice, regulation alerts, and live stocking updates.
      </p>
      <button className="cw-btn cw-btn-primary" onClick={onStart}>
        Begin intake <ChevronRight size={16}/>
      </button>
      <div className="cw-welcome-foot">
        <span>406</span> public access sites
        <span className="cw-welcome-foot-dot"/>
        <span>2026</span> regulations
      </div>
    </div>
  );
}

// ============================================================
// INTAKE
// ============================================================
const INTAKE_STEPS = [
  { key: 'experience', title: 'How would you describe your experience?', type: 'single',
    options: [
      { v: 'beginner', label: 'Beginner', sub: 'New to fishing or just starting' },
      { v: 'intermediate', label: 'Intermediate', sub: 'Comfortable with the basics' },
      { v: 'advanced', label: 'Advanced', sub: 'Years of experience' }
    ]
  },
  { key: 'frequency', title: 'How often do you fish?', type: 'single',
    options: [
      { v: 'rarely', label: 'A few times a year' },
      { v: 'monthly', label: 'Once or twice a month' },
      { v: 'weekly', label: 'Weekly' },
      { v: 'daily', label: 'As often as I can' }
    ]
  },
  { key: 'fishingTypes', title: 'What kind of fishing interests you?', type: 'multi',
    options: [
      { v: 'fly', label: 'Fly fishing' },
      { v: 'spin', label: 'Spin / casting' },
      { v: 'bait', label: 'Bait fishing' },
      { v: 'trolling', label: 'Trolling' },
      { v: 'ice', label: 'Ice fishing' }
    ]
  },
  { key: 'gear', title: 'What gear do you own?', type: 'multi',
    options: [
      { v: 'spinning-rod', label: 'Spinning rod' },
      { v: 'baitcaster', label: 'Baitcaster' },
      { v: 'fly-rod', label: 'Fly rod' },
      { v: 'tackle-box', label: 'Tackle box / lures' },
      { v: 'waders', label: 'Waders' },
      { v: 'kayak', label: 'Kayak / float tube' },
      { v: 'boat', label: 'Boat' },
      { v: 'electronics', label: 'Fish finder / GPS' }
    ]
  },
  { key: 'location', title: 'Where in Washington are you based?', type: 'single',
    options: [
      { v: 'Northwest', label: 'Northwest', sub: 'Seattle, Bellingham, Olympic Peninsula' },
      { v: 'Southwest', label: 'Southwest', sub: 'Vancouver, Olympia, Longview' },
      { v: 'Central', label: 'Central', sub: 'Wenatchee, Yakima, Ellensburg' },
      { v: 'Eastern', label: 'Eastern', sub: 'Spokane, Tri-Cities, Walla Walla' }
    ]
  },
  { key: 'travel', title: 'Will you travel to fish?', type: 'single',
    options: [
      { v: 'local', label: 'Local only', sub: 'Waters close to home' },
      { v: 'travel', label: "I'll travel", sub: 'Show me anywhere in the state' }
    ]
  },
  { key: 'accessType', title: 'How do you fish?', type: 'multi',
    options: [
      { v: 'bank', label: 'From the bank' },
      { v: 'boat', label: 'From a boat' },
      { v: 'wade', label: 'Wading' }
    ]
  }
];

function Intake({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    experience: '', frequency: '', fishingTypes: [], gear: [],
    location: '', travel: '', accessType: []
  });

  const current = INTAKE_STEPS[step];
  const value = answers[current.key];
  const canAdvance = current.type === 'multi' ? value.length > 0 : value !== '';

  const handleSelect = (v) => {
    if (current.type === 'multi') {
      const arr = value.includes(v) ? value.filter(x => x !== v) : [...value, v];
      setAnswers({ ...answers, [current.key]: arr });
    } else {
      setAnswers({ ...answers, [current.key]: v });
    }
  };

  const next = () => {
    if (step < INTAKE_STEPS.length - 1) setStep(step + 1);
    else onComplete(answers);
  };

  return (
    <div className="cw-screen cw-intake">
      <div className="cw-intake-head">
        <div className="cw-progress">
          <div className="cw-progress-bar" style={{ width: `${((step + 1) / INTAKE_STEPS.length) * 100}%` }}/>
        </div>
        <div className="cw-step-lbl">Step {step + 1} / {INTAKE_STEPS.length}</div>
      </div>
      <h2 className="cw-intake-title">{current.title}</h2>
      {current.type === 'multi' && <p className="cw-intake-sub">Select all that apply</p>}

      <div className="cw-options">
        {current.options.map(opt => {
          const sel = current.type === 'multi' ? value.includes(opt.v) : value === opt.v;
          return (
            <button key={opt.v} className={`cw-option ${sel ? 'sel' : ''}`} onClick={() => handleSelect(opt.v)}>
              <div className="cw-option-text">
                <div className="cw-option-lbl">{opt.label}</div>
                {opt.sub && <div className="cw-option-sub">{opt.sub}</div>}
              </div>
              <div className="cw-option-check">{sel && <Check size={14}/>}</div>
            </button>
          );
        })}
      </div>

      <div className="cw-intake-actions">
        {step > 0 && (
          <button className="cw-btn cw-btn-ghost" onClick={() => setStep(step - 1)}>
            <ChevronLeft size={14}/> Back
          </button>
        )}
        <button className="cw-btn cw-btn-primary cw-btn-grow" disabled={!canAdvance} onClick={next}>
          {step === INTAKE_STEPS.length - 1 ? 'Finish' : 'Continue'} <ChevronRight size={14}/>
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MAP VIEW
// ============================================================
function MapView({ profile, trip, onSelect, onViewTrip, onReset }) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('map'); // 'map', 'updates'

  const filtered = useMemo(() => SITES.filter(s => {
    if (profile.travel === 'local' && s.region !== profile.location) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.county.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [profile, search]);

  const WA = { minLat: 45.5, maxLat: 49.0, minLng: -124.8, maxLng: -116.9 };
  const project = (lat, lng) => ({
    x: ((lng - WA.minLng) / (WA.maxLng - WA.minLng)) * 100,
    y: ((WA.maxLat - lat) / (WA.maxLat - WA.minLat)) * 100
  });

  return (
    <div className="cw-screen cw-map">
      <div className="cw-map-top">
        <div>
          <div className="cw-map-h">Field map</div>
          <div className="cw-map-sub">{filtered.length} matched sites</div>
        </div>
        <div className="cw-map-top-actions">
          {trip && (
            <button className="cw-trip-pill" onClick={onViewTrip} title="View trip">
              <Calendar size={11}/>
            </button>
          )}
          <button className="cw-icon-btn" onClick={onReset} title="Reset">
            <Settings size={13}/>
          </button>
        </div>
      </div>

      <div className="cw-map-tabs">
        <button className={`cw-tab ${tab === 'map' ? 'active' : ''}`} onClick={() => setTab('map')}>
          <MapPin size={12}/> Map
        </button>
        <button className={`cw-tab ${tab === 'updates' ? 'active' : ''}`} onClick={() => setTab('updates')}>
          <Bell size={12}/> Updates
          <span className="cw-tab-dot"/>
        </button>
      </div>

      {tab === 'map' && (
        <>
          <div className="cw-search">
            <Search size={13}/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or county…"/>
          </div>

          <div className="cw-mapcanvas-wrap">
            <div className="cw-mapcanvas">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="cw-wa">
                <path
                  d="M 2,16 L 18,13 L 35,9 L 55,10 L 78,9 L 97,12 L 98,30 L 96,55 L 94,75 L 88,82 L 70,85 L 50,86 L 30,84 L 15,78 L 8,65 L 5,40 Z"
                  fill="var(--cream)" stroke="var(--green-deep)" strokeWidth="0.4"
                />
                <line x1="50" y1="10" x2="50" y2="85" stroke="var(--green-deep)" strokeWidth="0.12" strokeDasharray="0.5 0.7" opacity="0.35"/>
                <line x1="2" y1="50" x2="98" y2="50" stroke="var(--green-deep)" strokeWidth="0.12" strokeDasharray="0.5 0.7" opacity="0.35"/>
                <text x="25" y="28" fontSize="1.8" fill="var(--green-deep)" opacity="0.5" textAnchor="middle">NORTHWEST</text>
                <text x="75" y="28" fontSize="1.8" fill="var(--green-deep)" opacity="0.5" textAnchor="middle">CENTRAL</text>
                <text x="25" y="72" fontSize="1.8" fill="var(--green-deep)" opacity="0.5" textAnchor="middle">SOUTHWEST</text>
                <text x="75" y="72" fontSize="1.8" fill="var(--green-deep)" opacity="0.5" textAnchor="middle">EASTERN</text>

                {filtered.map(s => {
                  const { x, y } = project(s.lat, s.lng);
                  const isTrip = trip && trip.site.id === s.id;
                  const isStocked = !!s.stocked;
                  return (
                    <g key={s.id} className={`cw-pin ${isTrip ? 'cw-pin-trip' : ''} ${isStocked ? 'cw-pin-stocked' : ''}`}
                       transform={`translate(${x},${y})`}
                       onClick={() => onSelect(s)}
                       style={{ cursor: 'pointer' }}>
                      {isStocked && <circle r="2.2" fill="var(--gold)" opacity="0.4"/>}
                      <circle r="1.1" fill={isTrip ? 'var(--gold)' : isStocked ? 'var(--gold)' : 'var(--green-deep)'} stroke="var(--cream)" strokeWidth="0.3"/>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="cw-map-legend">
              <span className="cw-leg"><span className="cw-leg-dot cw-leg-green"/>Site</span>
              <span className="cw-leg"><span className="cw-leg-dot cw-leg-gold"/>Stocked</span>
              {trip && <span className="cw-leg"><span className="cw-leg-dot cw-leg-trip"/>Your trip</span>}
            </div>
          </div>

          <div className="cw-list">
            {filtered.slice(0, 50).map(s => (
              <button key={s.id} className="cw-list-item" onClick={() => onSelect(s)}>
                <div className="cw-list-item-main">
                  <div className="cw-list-item-name">
                    {s.name}
                    {s.stocked && <span className="cw-list-flag"><Droplets size={9}/></span>}
                  </div>
                  <div className="cw-list-item-meta">{s.county} Co · {s.species.slice(0,2).join(', ')}</div>
                </div>
                <ChevronRight size={14}/>
              </button>
            ))}
            {filtered.length > 50 && (
              <div className="cw-list-more">Showing 50 of {filtered.length}. Refine search to see more.</div>
            )}
            {filtered.length === 0 && (
              <div className="cw-list-empty">No matches. Try adjusting your search or opening up travel preferences.</div>
            )}
          </div>
        </>
      )}

      {tab === 'updates' && <UpdatesFeed onSelectSite={(name) => {
        const found = SITES.find(s => s.name === name);
        if (found) onSelect(found);
      }}/>}
    </div>
  );
}

// ============================================================
// UPDATES FEED — stocking + opening
// ============================================================
function UpdatesFeed({ onSelectSite }) {
  return (
    <div className="cw-updates">
      <div className="cw-updates-intro">
        <Sparkles size={12}/> Pulled from WDFW weekly stocking reports
      </div>
      {STOCKING_UPDATES.map((u, i) => (
        <button key={i} className={`cw-update cw-update-${u.tag}`} onClick={() => u.tag === 'stocked' && onSelectSite(u.site)}>
          <div className="cw-update-date">{u.date}</div>
          <div className="cw-update-body">
            <div className="cw-update-site">
              {u.tag === 'stocked' ? <Droplets size={11}/> : <Sun size={11}/>}
              {u.site}
            </div>
            <div className="cw-update-detail">{u.detail}</div>
          </div>
          <div className={`cw-update-tag cw-update-tag-${u.tag}`}>
            {u.tag === 'stocked' ? 'Stocked' : 'Opening'}
          </div>
        </button>
      ))}
      <div className="cw-updates-foot">
        Stocking schedule subject to change. Verify at wdfw.wa.gov/fishing/reports
      </div>
    </div>
  );
}

// ============================================================
// SITE PROFILE
// ============================================================
function SiteProfile({ site, inTrip, onBack, onAdd }) {
  return (
    <div className="cw-screen cw-site">
      <button className="cw-back" onClick={onBack}><ArrowLeft size={13}/> Back</button>

      <div className="cw-site-head">
        <div className="cw-site-county">{site.county} Co · {site.region} WA · {site.type}</div>
        <h1 className="cw-site-name">{site.name}</h1>
        <div className="cw-site-mgr">Managed by {site.manager}</div>
      </div>

      {(site.stocked || site.opening) && (
        <div className="cw-alerts">
          {site.stocked && (
            <div className="cw-alert cw-alert-stock">
              <Droplets size={13}/>
              <div>
                <strong>Recently stocked</strong>
                <span>{site.stocked}</span>
              </div>
            </div>
          )}
          {site.opening && (
            <div className="cw-alert cw-alert-open">
              <Sun size={13}/>
              <div>
                <strong>Season opening</strong>
                <span>{site.opening}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <section className="cw-site-section">
        <h3><Fish size={11}/> Likely species</h3>
        <div className="cw-chips">
          {site.species.map(sp => <span key={sp} className="cw-chip">{sp}</span>)}
        </div>
        {!site.isCurated && (
          <div className="cw-disclaim">Species are inferred from waterbody type. Verify locally before fishing.</div>
        )}
      </section>

      <section className="cw-site-section">
        <h3><Anchor size={11}/> Access & infrastructure</h3>
        <div className="cw-facts">
          <div className="cw-fact">
            <div className="cw-fact-n">{site.boatRamps}</div>
            <div className="cw-fact-l">Boat ramps</div>
          </div>
          <div className="cw-fact">
            <div className="cw-fact-n">{site.handLaunches}</div>
            <div className="cw-fact-l">Hand launches</div>
          </div>
          <div className="cw-fact">
            <div className="cw-fact-n">{site.fishingPlatforms}</div>
            <div className="cw-fact-l">Platforms</div>
          </div>
          <div className="cw-fact">
            <div className="cw-fact-n">{site.restrooms}</div>
            <div className="cw-fact-l">Restrooms</div>
          </div>
        </div>
        {(site.ada_parking > 0 || site.ada_loading || site.ada_restrooms > 0) && (
          <div className="cw-ada">
            <Accessibility size={11}/>
            <span>
              ADA features:
              {site.ada_parking > 0 && ` ${site.ada_parking} parking stall${site.ada_parking > 1 ? 's' : ''}`}
              {site.ada_loading && ', loading platform'}
              {site.ada_restrooms > 0 && `, ${site.ada_restrooms} restroom${site.ada_restrooms > 1 ? 's' : ''}`}
            </span>
          </div>
        )}
        {site.ramp_surface && (
          <div className="cw-detail">Ramp surface: {site.ramp_surface}</div>
        )}
        {site.camping && (
          <div className="cw-detail"><Tent size={11}/> Camping allowed on site</div>
        )}
      </section>

      <section className="cw-site-section cw-site-section-rules">
        <h3><BookOpen size={11}/> Access regulations</h3>
        <div className="cw-detail-block">
          <strong>Closure status:</strong> {site.closure}
        </div>
        {site.openDates && <div className="cw-detail-block">{site.openDates}</div>}
        {site.notes && <div className="cw-detail-block cw-notes">{site.notes}</div>}
        <div className="cw-disclaim">
          Always verify current fishing rules and emergency regulations at wdfw.wa.gov before fishing.
        </div>
      </section>

      <div className="cw-site-cta">
        {inTrip ? (
          <button className="cw-btn cw-btn-primary" disabled><Check size={14}/> Added to trip</button>
        ) : (
          <button className="cw-btn cw-btn-primary cw-btn-grow" onClick={onAdd}>
            <Plus size={14}/> Add to next trip
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// TRIP VIEW with Claude API
// ============================================================
function TripView({ profile, trip, onBack, onRemove }) {
  const [briefing, setBriefing] = useState('');
  const [briefingLoading, setBriefingLoading] = useState(true);
  const [briefingError, setBriefingError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef(null);

  const system = buildSystemPrompt(profile, trip.site);

  useEffect(() => {
    (async () => {
      try {
        setBriefingLoading(true);
        const prompt = `I'm planning a fishing trip to ${trip.site.name} in ${trip.site.county} County. Give me a tailored trip briefing now — gear recommendations specific to what I own and what I'd need, the most important alerts (closure, stocking, opening), and 2-3 practical tactics for what's likely there. Don't ask me questions — just give me the briefing.`;
        const r = await askClaude([{ role: 'user', content: prompt }], system);
        setBriefing(r);
      } catch (e) {
        setBriefingError(true);
      } finally {
        setBriefingLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const send = async () => {
    if (!input.trim() || chatLoading) return;
    const userMsg = input.trim();
    setInput('');
    const newMsgs = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMsgs);
    setChatLoading(true);
    try {
      const conversation = [
        { role: 'user', content: `I'm planning a fishing trip to ${trip.site.name}. Give me a briefing.` },
        { role: 'assistant', content: briefing },
        ...newMsgs
      ];
      const reply = await askClaude(conversation, system);
      setMessages([...newMsgs, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages([...newMsgs, { role: 'assistant', content: '_Could not reach the API. Try again._' }]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, chatLoading]);

  return (
    <div className="cw-screen cw-trip">
      <button className="cw-back" onClick={onBack}><ArrowLeft size={13}/> Back</button>

      <div className="cw-trip-head">
        <div className="cw-trip-eyebrow"><Sparkles size={11}/> Your trip briefing</div>
        <h1 className="cw-trip-name">{trip.site.name}</h1>
        <div className="cw-trip-meta">{trip.site.county} Co · {trip.site.species.slice(0,3).join(' · ')}</div>
      </div>

      <div className="cw-briefing">
        {briefingLoading && (
          <div className="cw-briefing-loading">
            <Loader2 size={14} className="cw-spin"/>
            <span>Tying on your briefing…</span>
          </div>
        )}
        {briefingError && (
          <div className="cw-briefing-error">Couldn't generate briefing. Check connection.</div>
        )}
        {briefing && !briefingLoading && (
          <div className="cw-briefing-body">
            <FormattedText text={briefing}/>
          </div>
        )}
      </div>

      <div className="cw-chat">
        <div className="cw-chat-head"><MessageCircle size={11}/> <span>Ask CastWise</span></div>
        <div className="cw-chat-msgs" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="cw-chat-empty">
              Ask about bait, tactics, regulations, where to launch — anything.
              <div className="cw-chat-suggest">
                {['Best time of day?', 'What to bring?', 'How are tactics different here?'].map(s => (
                  <button key={s} onClick={() => setInput(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`cw-msg cw-msg-${m.role}`}>
              <div className="cw-msg-lbl">{m.role === 'user' ? 'You' : 'CastWise'}</div>
              <div className="cw-msg-body">
                {m.role === 'assistant' ? <FormattedText text={m.content}/> : m.content}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="cw-msg cw-msg-assistant">
              <div className="cw-msg-lbl">CastWise</div>
              <div className="cw-msg-body"><Loader2 size={12} className="cw-spin"/></div>
            </div>
          )}
        </div>
        <div className="cw-chat-input-row">
          <input
            className="cw-chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
            placeholder="Ask anything…"
            disabled={chatLoading || briefingLoading}
          />
          <button className="cw-chat-send" onClick={send} disabled={chatLoading || briefingLoading || !input.trim()}>
            <Send size={13}/>
          </button>
        </div>
      </div>

      <button className="cw-btn-text" onClick={onRemove}><X size={11}/> Remove trip</button>
    </div>
  );
}

// ============================================================
// FORMATTED TEXT
// ============================================================
function FormattedText({ text }) {
  const lines = text.split('\n');
  const blocks = [];
  let list = [];
  const flush = () => { if (list.length) { blocks.push({ t: 'ul', items: list }); list = []; } };

  lines.forEach(line => {
    const tr = line.trim();
    if (/^(⚠️?\s*)?(\*\*)?(ALERT|IMPORTANT|WARNING|HEADS UP)/i.test(tr)) {
      flush();
      blocks.push({ t: 'alert', content: tr.replace(/^\*\*|\*\*$/g, '').replace(/^⚠️?\s*/, '').replace(/^(ALERT|IMPORTANT|WARNING|HEADS UP)[:\s]*/i, '') });
    } else if (tr.startsWith('## ') || tr.startsWith('# ')) {
      flush(); blocks.push({ t: 'h', content: tr.replace(/^#+\s/, '') });
    } else if (tr.startsWith('### ')) {
      flush(); blocks.push({ t: 'h3', content: tr.slice(4) });
    } else if (tr.startsWith('- ') || tr.startsWith('* ')) {
      list.push(tr.slice(2));
    } else if (/^\d+\.\s/.test(tr)) {
      list.push(tr.replace(/^\d+\.\s/, ''));
    } else if (tr === '') {
      flush();
    } else {
      flush(); blocks.push({ t: 'p', content: tr });
    }
  });
  flush();

  const inline = (s) => s.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2,-2)}</strong> : <React.Fragment key={i}>{p}</React.Fragment>
  );

  return (
    <div className="cw-fmt">
      {blocks.map((b, i) => {
        if (b.t === 'h') return <h4 key={i} className="cw-fmt-h">{inline(b.content)}</h4>;
        if (b.t === 'h3') return <h5 key={i} className="cw-fmt-h3">{inline(b.content)}</h5>;
        if (b.t === 'p') return <p key={i} className="cw-fmt-p">{inline(b.content)}</p>;
        if (b.t === 'ul') return <ul key={i} className="cw-fmt-ul">{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ul>;
        if (b.t === 'alert') return (
          <div key={i} className="cw-fmt-alert">
            <AlertTriangle size={12}/>
            <span>{inline(b.content)}</span>
          </div>
        );
        return null;
      })}
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles = `
  :root {
    --green-deep: #1f3a1d;
    --green: #2d5a2a;
    --green-mid: #4e8b3a;
    --green-light: #6ba944;
    --gold: #e8b820;
    --gold-deep: #b48714;
    --gold-soft: #f3d76b;
    --cream: #f4ecd6;
    --cream-warm: #e8dfc0;
    --bark: #3d2e1f;
    --ink: #1a2415;
    --ink-soft: #3d4435;
    --ink-fade: #6b7160;
    --alert: #c44a1f;
    --alert-bg: #f5d9c5;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --display: 'Cormorant Garamond', Georgia, serif;
    --sans: 'IBM Plex Sans', 'Helvetica Neue', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

  /* STAGE — the green outdoor backdrop */
  .cw-stage {
    font-family: var(--sans);
    background: var(--green);
    background-image:
      radial-gradient(ellipse at top left, var(--green-mid) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, var(--green-deep) 0%, transparent 60%);
    color: var(--ink);
    min-height: 100vh;
    width: 100%;
    position: relative;
    overflow: hidden;
    padding: 24px 16px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }

  /* DECOR */
  .cw-decor-trees {
    position: absolute;
    bottom: 0; left: 0;
    width: 100%;
    height: 240px;
    color: var(--green-deep);
    z-index: 0;
    pointer-events: none;
  }
  .cw-decor-rings {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    color: var(--cream);
    z-index: 0;
    opacity: 0.7;
    pointer-events: none;
  }
  .cw-decor-icons {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .cw-decor-icons .ic {
    position: absolute;
    color: var(--green-deep);
    opacity: 0.45;
  }
  .ic-1 { top: 14%;  left: 12%; width: 50px; transform: rotate(-12deg); }
  .ic-2 { top: 36%;  left: 6%;  width: 44px; transform: rotate(20deg); }
  .ic-3 { top: 60%;  left: 10%; width: 46px; }
  .ic-4 { top: 18%;  right: 11%; width: 32px; transform: rotate(15deg); }
  .ic-5 { top: 44%;  right: 6%; width: 50px; transform: scaleX(-1) rotate(-8deg); }
  .ic-6 { top: 64%;  right: 12%; width: 40px; }
  .ic-7 { top: 80%;  left: 50%; width: 50px; transform: translateX(-50%); opacity: 0.3; }
  .ic-8 { top: 26%;  left: 50%; width: 38px; transform: translateX(-50%) rotate(8deg); opacity: 0.25; }

  @media (max-width: 900px) {
    .cw-decor-icons .ic { display: none; }
  }

  /* BRAND HEADER */
  .cw-brand-header {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 18px;
    gap: 6px;
  }
  .cw-brand-pill {
    background: var(--cream);
    padding: 10px 22px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.18);
  }
  .cw-brand-pill-mark { display: inline-flex; }
  .cw-brand-pill-text {
    font-family: var(--display);
    font-size: 30px;
    font-weight: 700;
    color: var(--green-deep);
    line-height: 1;
    letter-spacing: -0.01em;
  }
  .cw-brand-pill-text em {
    font-style: italic;
    color: var(--gold-deep);
    font-weight: 600;
  }
  .cw-brand-tag {
    color: var(--cream);
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    opacity: 0.7;
  }

  /* PHONE */
  .cw-phone {
    position: relative;
    z-index: 3;
    width: 100%;
    max-width: 380px;
    background: #0a0f0a;
    border-radius: 38px;
    padding: 10px 8px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.08),
      0 20px 50px rgba(0,0,0,0.4),
      0 8px 20px rgba(0,0,0,0.25);
  }
  .cw-phone-notch {
    width: 100px;
    height: 22px;
    background: #0a0f0a;
    border-radius: 0 0 14px 14px;
    margin: 0 auto -1px;
    position: relative;
    z-index: 2;
  }
  .cw-phone-screen {
    background: var(--cream);
    border-radius: 28px;
    height: 720px;
    overflow: hidden;
    position: relative;
  }
  .cw-phone-bar {
    width: 100px;
    height: 4px;
    background: rgba(255,255,255,0.3);
    border-radius: 2px;
    margin: 8px auto 4px;
  }

  /* SCREEN — base container inside phone */
  .cw-screen {
    height: 100%;
    overflow-y: auto;
    padding: 24px 20px 24px;
    box-sizing: border-box;
    animation: cwFade 0.4s ease-out;
  }
  .cw-screen::-webkit-scrollbar { width: 4px; }
  .cw-screen::-webkit-scrollbar-thumb { background: var(--cream-warm); border-radius: 2px; }

  @keyframes cwFade {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* SIDE STATS CARD (desktop only) */
  .cw-side-card {
    position: absolute;
    right: max(20px, calc(50% - 380px));
    top: 240px;
    width: 220px;
    background: #1a2415;
    color: var(--cream);
    padding: 18px 18px 16px;
    border-radius: 8px;
    box-shadow: 0 12px 30px rgba(0,0,0,0.3);
    z-index: 2;
    border-top: 3px solid var(--gold);
  }
  .cw-side-title {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 10px;
  }
  .cw-side-divider { height: 1px; background: rgba(255,255,255,0.1); margin-bottom: 12px; }
  .cw-side-name {
    font-family: var(--display);
    font-size: 20px;
    font-weight: 600;
    line-height: 1.15;
    margin-bottom: 4px;
  }
  .cw-side-meta {
    font-family: var(--serif);
    font-style: italic;
    font-size: 12px;
    opacity: 0.7;
    margin-bottom: 14px;
  }
  .cw-side-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 14px;
    margin-bottom: 12px;
  }
  .cw-side-num {
    font-family: var(--display);
    font-size: 22px;
    font-weight: 600;
    color: var(--gold-soft);
    line-height: 1;
  }
  .cw-side-lbl {
    font-size: 10px;
    color: var(--cream);
    opacity: 0.6;
    margin-top: 2px;
    letter-spacing: 0.04em;
  }
  .cw-side-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--gold);
    color: var(--green-deep);
    padding: 6px 10px;
    border-radius: 3px;
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 500;
  }

  @media (max-width: 1100px) {
    .cw-side-card { display: none; }
  }

  /* FOOTER RIBBON */
  .cw-footer-ribbon {
    position: relative;
    z-index: 2;
    margin: 28px 0 24px;
    color: var(--cream);
    opacity: 0.6;
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .cw-footer-ribbon .dot {
    width: 3px; height: 3px;
    background: var(--gold);
    border-radius: 50%;
  }

  /* BUTTONS */
  .cw-btn {
    border: none;
    cursor: pointer;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 18px;
    border-radius: 4px;
    transition: all 0.18s;
  }
  .cw-btn-primary {
    background: var(--green-deep);
    color: var(--cream);
  }
  .cw-btn-primary:hover:not(:disabled) {
    background: var(--ink);
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }
  .cw-btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .cw-btn-ghost {
    background: transparent;
    color: var(--ink-soft);
    border: 1px solid var(--cream-warm);
  }
  .cw-btn-ghost:hover {
    background: var(--cream-warm);
  }
  .cw-btn-grow { flex: 1; }
  .cw-btn-text {
    background: none;
    border: none;
    color: var(--ink-fade);
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 8px 12px;
    margin: 0 auto;
  }
  .cw-btn-text:hover { color: var(--alert); }

  /* LOADING */
  .cw-loading {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--ink-fade);
    font-family: var(--serif);
    font-style: italic;
    font-size: 15px;
  }
  .cw-spin-slow { animation: bob 2s ease-in-out infinite; color: var(--green); }
  .cw-spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }

  /* WELCOME */
  .cw-welcome {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 36px;
  }
  .cw-welcome-emblem {
    width: 90px;
    height: 90px;
    margin-bottom: 22px;
  }
  .cw-welcome-emblem svg { width: 100%; height: 100%; }
  .cw-welcome-title {
    font-family: var(--display);
    font-size: 54px;
    font-weight: 600;
    color: var(--green-deep);
    line-height: 1;
    margin: 0 0 12px;
    letter-spacing: -0.02em;
  }
  .cw-welcome-title em {
    font-style: italic;
    color: var(--gold-deep);
    font-weight: 500;
  }
  .cw-welcome-rule {
    display: flex; justify-content: center; align-items: center;
    gap: 6px;
    margin-bottom: 18px;
  }
  .cw-welcome-rule span {
    width: 32px; height: 1px;
    background: var(--green);
    position: relative;
  }
  .cw-welcome-rule span::before,
  .cw-welcome-rule span::after {
    content: ''; position: absolute;
    width: 4px; height: 4px;
    background: var(--gold);
    border-radius: 50%;
    top: -1.5px;
  }
  .cw-welcome-rule span::before { left: -8px; }
  .cw-welcome-rule span::after  { right: -8px; }
  .cw-welcome-tag {
    font-family: var(--serif);
    font-style: italic;
    font-size: 16px;
    color: var(--green);
    margin: 0 0 20px;
  }
  .cw-welcome-body {
    font-size: 13px;
    line-height: 1.65;
    color: var(--ink-soft);
    max-width: 280px;
    margin: 0 0 28px;
  }
  .cw-welcome-foot {
    margin-top: 24px;
    font-family: var(--mono);
    font-size: 9px;
    color: var(--ink-fade);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .cw-welcome-foot span:not(.cw-welcome-foot-dot) {
    color: var(--green-deep);
    font-weight: 600;
  }
  .cw-welcome-foot-dot {
    width: 3px; height: 3px;
    background: var(--gold);
    border-radius: 50%;
  }

  /* INTAKE */
  .cw-intake-head { margin-bottom: 22px; }
  .cw-progress {
    height: 3px;
    background: var(--cream-warm);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
  }
  .cw-progress-bar {
    height: 100%;
    background: var(--gold);
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .cw-step-lbl {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-fade);
  }
  .cw-intake-title {
    font-family: var(--display);
    font-size: 26px;
    font-weight: 600;
    line-height: 1.15;
    color: var(--green-deep);
    margin: 0 0 4px;
    letter-spacing: -0.01em;
  }
  .cw-intake-sub {
    font-family: var(--serif);
    font-style: italic;
    font-size: 13px;
    color: var(--ink-fade);
    margin: 0 0 18px;
  }
  .cw-options {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 20px;
  }
  .cw-option {
    background: var(--cream-warm);
    border: 1px solid transparent;
    padding: 13px 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    text-align: left;
    font-family: var(--sans);
    transition: all 0.15s;
    border-radius: 4px;
  }
  .cw-option:hover {
    background: #ddd0b3;
  }
  .cw-option.sel {
    background: var(--green-deep);
    color: var(--cream);
    border-color: var(--gold);
  }
  .cw-option.sel .cw-option-sub { color: rgba(244, 236, 214, 0.7); }
  .cw-option-text { flex: 1; }
  .cw-option-lbl { font-size: 13px; font-weight: 500; margin-bottom: 1px; }
  .cw-option-sub {
    font-size: 10px;
    color: var(--ink-fade);
    font-family: var(--serif);
    font-style: italic;
  }
  .cw-option-check {
    width: 18px; height: 18px;
    border: 1px solid currentColor;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    opacity: 0.3;
  }
  .cw-option.sel .cw-option-check {
    opacity: 1;
    background: var(--gold);
    color: var(--green-deep);
    border-color: var(--gold);
  }
  .cw-intake-actions { display: flex; gap: 8px; }

  /* MAP */
  .cw-map-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .cw-map-h {
    font-family: var(--display);
    font-size: 22px;
    font-weight: 600;
    color: var(--green-deep);
    line-height: 1;
  }
  .cw-map-sub {
    font-family: var(--serif);
    font-style: italic;
    font-size: 11px;
    color: var(--ink-fade);
    margin-top: 2px;
  }
  .cw-map-top-actions { display: flex; gap: 6px; }
  .cw-trip-pill {
    background: var(--gold);
    color: var(--green-deep);
    border: none;
    width: 26px; height: 26px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .cw-trip-pill:hover { transform: scale(1.1); }
  .cw-icon-btn {
    background: transparent;
    border: 1px solid var(--cream-warm);
    width: 26px; height: 26px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--ink-soft);
    transition: all 0.2s;
  }
  .cw-icon-btn:hover { background: var(--green-deep); color: var(--cream); border-color: var(--green-deep); }

  .cw-map-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 14px;
    border-bottom: 1px solid var(--cream-warm);
  }
  .cw-tab {
    background: none;
    border: none;
    padding: 8px 4px;
    margin-bottom: -1px;
    cursor: pointer;
    font-family: var(--sans);
    font-size: 11px;
    color: var(--ink-fade);
    border-bottom: 2px solid transparent;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    position: relative;
    font-weight: 500;
  }
  .cw-tab.active {
    color: var(--green-deep);
    border-bottom-color: var(--gold);
  }
  .cw-tab-dot {
    position: absolute;
    top: 6px;
    right: -2px;
    width: 5px; height: 5px;
    background: var(--alert);
    border-radius: 50%;
  }

  .cw-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--cream-warm);
    padding: 8px 10px;
    border-radius: 4px;
    margin-bottom: 12px;
    color: var(--ink-fade);
  }
  .cw-search input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    font-family: var(--sans);
    font-size: 12px;
    color: var(--ink);
  }
  .cw-search input::placeholder { color: var(--ink-fade); }

  .cw-mapcanvas-wrap {
    margin-bottom: 16px;
  }
  .cw-mapcanvas {
    background: var(--cream);
    border: 1px solid var(--cream-warm);
    border-radius: 4px;
    padding: 8px;
    aspect-ratio: 1.3/1;
    position: relative;
  }
  .cw-wa { width: 100%; height: 100%; }
  .cw-pin circle:nth-child(1) { animation: pulse 2.5s infinite ease-in-out; transform-origin: center; }
  .cw-pin:hover circle:last-child {
    fill: var(--gold) !important;
    r: 1.5;
  }
  @keyframes pulse {
    0%, 100% { r: 2.2; opacity: 0.45; }
    50% { r: 3; opacity: 0.15; }
  }
  .cw-pin-trip circle:last-child {
    r: 1.4;
    stroke: var(--green-deep);
  }
  .cw-map-legend {
    display: flex;
    gap: 14px;
    margin-top: 8px;
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-fade);
  }
  .cw-leg { display: inline-flex; align-items: center; gap: 4px; }
  .cw-leg-dot { width: 6px; height: 6px; border-radius: 50%; }
  .cw-leg-green { background: var(--green-deep); }
  .cw-leg-gold { background: var(--gold); }
  .cw-leg-trip { background: var(--gold); border: 1px solid var(--green-deep); }

  .cw-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .cw-list-item {
    background: var(--cream-warm);
    border: none;
    padding: 12px 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    text-align: left;
    font-family: var(--sans);
    transition: all 0.15s;
    border-radius: 3px;
  }
  .cw-list-item:hover {
    background: var(--green-deep);
    color: var(--cream);
  }
  .cw-list-item:hover .cw-list-item-meta { color: rgba(244, 236, 214, 0.7); }
  .cw-list-item-main { flex: 1; min-width: 0; }
  .cw-list-item-name {
    font-family: var(--display);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .cw-list-flag {
    background: var(--gold);
    color: var(--green-deep);
    padding: 2px 4px;
    border-radius: 2px;
    display: inline-flex;
  }
  .cw-list-item-meta {
    font-size: 10px;
    color: var(--ink-fade);
    font-family: var(--serif);
    font-style: italic;
    margin-top: 2px;
  }
  .cw-list-more, .cw-list-empty {
    text-align: center;
    padding: 14px;
    color: var(--ink-fade);
    font-family: var(--serif);
    font-style: italic;
    font-size: 11px;
  }

  /* UPDATES */
  .cw-updates { display: flex; flex-direction: column; gap: 8px; }
  .cw-updates-intro {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink-fade);
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 4px;
  }
  .cw-update {
    background: var(--cream-warm);
    border: none;
    text-align: left;
    padding: 12px 14px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    transition: all 0.15s;
    border-left: 3px solid var(--gold);
  }
  .cw-update:hover { background: #ddd0b3; }
  .cw-update-opening { border-left-color: var(--green-mid); cursor: default; }
  .cw-update-date {
    font-family: var(--mono);
    font-size: 9px;
    color: var(--ink-fade);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    flex-shrink: 0;
    min-width: 60px;
    padding-top: 1px;
  }
  .cw-update-body { flex: 1; }
  .cw-update-site {
    font-family: var(--display);
    font-size: 14px;
    font-weight: 600;
    color: var(--green-deep);
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 2px;
  }
  .cw-update-detail {
    font-size: 11px;
    color: var(--ink-soft);
    line-height: 1.4;
  }
  .cw-update-tag {
    font-family: var(--mono);
    font-size: 8px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 3px 6px;
    border-radius: 2px;
    flex-shrink: 0;
    font-weight: 600;
  }
  .cw-update-tag-stocked { background: var(--gold); color: var(--green-deep); }
  .cw-update-tag-opening { background: var(--green-mid); color: var(--cream); }
  .cw-updates-foot {
    margin-top: 8px;
    font-family: var(--serif);
    font-style: italic;
    font-size: 10px;
    color: var(--ink-fade);
    text-align: center;
    padding-top: 10px;
    border-top: 1px dashed var(--cream-warm);
  }

  /* BACK BUTTON */
  .cw-back {
    background: none;
    border: none;
    color: var(--ink-fade);
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 0;
    margin-bottom: 12px;
  }
  .cw-back:hover { color: var(--green-deep); }

  /* SITE PROFILE */
  .cw-site-head { margin-bottom: 18px; }
  .cw-site-county {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold-deep);
    margin-bottom: 6px;
  }
  .cw-site-name {
    font-family: var(--display);
    font-size: 30px;
    font-weight: 600;
    line-height: 1.05;
    color: var(--green-deep);
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }
  .cw-site-mgr {
    font-family: var(--serif);
    font-style: italic;
    color: var(--ink-fade);
    font-size: 12px;
  }

  .cw-alerts { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
  .cw-alert {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 4px;
    font-size: 12px;
  }
  .cw-alert-stock {
    background: var(--gold);
    color: var(--green-deep);
  }
  .cw-alert-open {
    background: var(--green-mid);
    color: var(--cream);
  }
  .cw-alert > svg { flex-shrink: 0; }
  .cw-alert div {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }
  .cw-alert strong {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 2px;
  }
  .cw-alert span {
    font-family: var(--display);
    font-size: 14px;
    font-weight: 600;
  }

  .cw-site-section {
    background: var(--cream-warm);
    padding: 14px 14px;
    border-radius: 4px;
    margin-bottom: 12px;
    border-left: 3px solid var(--green-mid);
  }
  .cw-site-section-rules { border-left-color: var(--gold); }
  .cw-site-section h3 {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--ink-soft);
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
  }
  .cw-chips { display: flex; flex-wrap: wrap; gap: 4px; }
  .cw-chip {
    background: var(--cream);
    padding: 3px 8px;
    font-size: 11px;
    border-radius: 2px;
    border: 1px solid #ddd0b3;
  }
  .cw-disclaim {
    font-family: var(--serif);
    font-style: italic;
    font-size: 10px;
    color: var(--ink-fade);
    margin-top: 8px;
    line-height: 1.5;
  }

  .cw-facts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 10px;
  }
  .cw-fact {
    text-align: center;
    padding: 6px 4px;
    background: var(--cream);
    border-radius: 3px;
  }
  .cw-fact-n {
    font-family: var(--display);
    font-size: 22px;
    font-weight: 600;
    color: var(--green-deep);
    line-height: 1;
  }
  .cw-fact-l {
    font-size: 9px;
    color: var(--ink-fade);
    margin-top: 2px;
    letter-spacing: 0.04em;
  }
  .cw-ada, .cw-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
    line-height: 1.4;
  }
  .cw-detail-block {
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 6px;
    line-height: 1.5;
  }
  .cw-notes {
    font-style: italic;
    font-family: var(--serif);
  }

  .cw-site-cta {
    margin-top: 16px;
    display: flex;
  }

  /* TRIP */
  .cw-trip-head { margin-bottom: 14px; }
  .cw-trip-eyebrow {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold-deep);
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 5px;
  }
  .cw-trip-name {
    font-family: var(--display);
    font-size: 28px;
    font-weight: 600;
    color: var(--green-deep);
    line-height: 1.05;
    margin: 0 0 4px;
  }
  .cw-trip-meta {
    font-family: var(--serif);
    font-style: italic;
    font-size: 12px;
    color: var(--ink-fade);
  }

  .cw-briefing {
    background: var(--cream-warm);
    padding: 14px 14px;
    border-radius: 4px;
    border-left: 3px solid var(--gold);
    margin-bottom: 14px;
    min-height: 70px;
  }
  .cw-briefing-loading, .cw-briefing-error {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--ink-fade);
    font-family: var(--serif);
    font-style: italic;
    font-size: 12px;
    padding: 12px 0;
  }

  /* CHAT */
  .cw-chat {
    background: var(--green-deep);
    color: var(--cream);
    padding: 14px 14px 10px;
    border-radius: 4px;
    margin-bottom: 12px;
  }
  .cw-chat-head {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold-soft);
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
  }
  .cw-chat-msgs {
    max-height: 280px;
    overflow-y: auto;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-right: 2px;
  }
  .cw-chat-msgs::-webkit-scrollbar { width: 3px; }
  .cw-chat-msgs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
  .cw-chat-empty {
    font-family: var(--serif);
    font-style: italic;
    font-size: 12px;
    line-height: 1.5;
    color: var(--cream-warm);
    padding: 4px 0;
  }
  .cw-chat-suggest {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 12px;
  }
  .cw-chat-suggest button {
    background: transparent;
    color: var(--cream);
    border: 1px solid rgba(244, 236, 214, 0.3);
    padding: 5px 9px;
    font-family: var(--sans);
    font-size: 10px;
    cursor: pointer;
    border-radius: 3px;
    font-style: normal;
    transition: all 0.2s;
  }
  .cw-chat-suggest button:hover {
    background: var(--gold);
    color: var(--green-deep);
    border-color: var(--gold);
  }
  .cw-msg-lbl {
    font-family: var(--mono);
    font-size: 8px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--cream-warm);
    margin-bottom: 4px;
    opacity: 0.7;
  }
  .cw-msg-user .cw-msg-lbl { color: var(--gold-soft); }
  .cw-msg-body { font-size: 12px; line-height: 1.55; }

  .cw-chat-input-row {
    display: flex;
    gap: 6px;
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  .cw-chat-input {
    flex: 1;
    background: transparent;
    border: 1px solid rgba(244, 236, 214, 0.3);
    color: var(--cream);
    padding: 8px 10px;
    font-family: var(--sans);
    font-size: 12px;
    outline: none;
    border-radius: 3px;
  }
  .cw-chat-input:focus { border-color: var(--gold); }
  .cw-chat-input::placeholder { color: rgba(244, 236, 214, 0.4); }
  .cw-chat-send {
    background: var(--gold);
    color: var(--green-deep);
    border: none;
    padding: 0 12px;
    cursor: pointer;
    border-radius: 3px;
    transition: background 0.2s;
  }
  .cw-chat-send:hover:not(:disabled) { background: var(--gold-soft); }
  .cw-chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

  /* FORMATTED TEXT */
  .cw-fmt { font-size: 12px; line-height: 1.55; }
  .cw-fmt-h {
    font-family: var(--display);
    font-size: 16px;
    font-weight: 600;
    margin: 10px 0 6px;
    letter-spacing: -0.01em;
    color: var(--green-deep);
  }
  .cw-fmt-h:first-child { margin-top: 0; }
  .cw-fmt-h3 {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 8px 0 4px;
  }
  .cw-fmt-p { margin: 0 0 7px; }
  .cw-fmt-p:last-child { margin-bottom: 0; }
  .cw-fmt-ul {
    margin: 0 0 8px;
    padding-left: 16px;
  }
  .cw-fmt-ul li { margin-bottom: 3px; }
  .cw-fmt-alert {
    background: var(--alert-bg);
    color: var(--alert);
    padding: 8px 10px;
    margin: 8px 0;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 11px;
    line-height: 1.45;
    border-left: 3px solid var(--alert);
    border-radius: 2px;
  }
  .cw-fmt-alert svg { margin-top: 1px; flex-shrink: 0; }

  /* Chat dark-context adjustments */
  .cw-msg-assistant .cw-fmt-h,
  .cw-msg-assistant .cw-fmt-h3 { color: var(--cream); }
  .cw-msg-assistant .cw-fmt-alert {
    background: rgba(196, 74, 31, 0.18);
    color: var(--gold-soft);
    border-left-color: var(--gold);
  }
`;
