# http-benchmarks 

This repo is for comparing [mist](https://github.com/rawhat/mist) to some other webserver libraries.

## Setup

This was run with both the client and servers on the same machine.

The specs are:

|Part|Spec|
|---|---|
|OS|   WSL Ubuntu 24.04.3 LTS (Windows 11 24H2)|
|CPU|  i5-13500H (16 threads)|
|RAM|  16GB|

The frameworks tested are:
  - Express (node 18.19.1)
  - Express 16-cluster (node 18.19.1)
  - Bandit (OTP 28 / Elixir 1.18.4)
  - Cowboy (OTP 28)
  - Mist (OTP 28)
  - Go (1.24.6)

Each of these sample projects has a `run.sh` file in its respective directory.
That's what I have been executing to start up the server.  These should
hopefully cover the "production" build for these.  Obviously please tell me
if you think I should be running something differently!  I want these results
to be as fair and explanatory as possible (for a relatively synthetic
benchmark, obviously).

NOTE:  I previously had flask + gunicorn in the test results, but was unable
to get the runner script executions to pass.  I'm not really sure why that's
happening at the moment, but for now I just omitted that case.

You can view the tests in `run.sh` but the cases are:

    - GET / -> ""
    - GET /user/:id -> id
    - POST /user -> <body>

Each application was tested with [h2load](https://nghttp2.org/documentation/h2load-howto.html) with 30s for each case noted above.  These tests were repeated with the concurrency flag set to 1, 2, 4, 6, 8, 12, and 16.

## Results

#### `GET /`

|Framework|Concurrency 1|2|4|6|8|12|16
|---|---|---|---|---|---|---|---
|express|10262.17req/s|10440.73req/s|10095.33req/s|10252.9req/s|10213.7req/s|10193.37req/s|10836.6req/s
|express-cluster|9040.6req/s|18556.2req/s|26619.97req/s|29934.27req/s|34312.43req/s|39962.37req/s|54007.83req/s
|bandit|21220.7req/s|31070.7req/s|46876.63req/s|60402.7req/s|74602.8req/s|95251.17req/s|114665.77req/s
|cowboy|19878.9req/s|29939.4req/s|54095.3req/s|61516.9req/s|71267.57req/s|95876.23req/s|120338.03req/s
|mist|21587.33req/s|34199.53req/s|52467.7req/s|63217.8req/s|75828.63req/s|96903req/s|122978.43req/s
|ewe|22622.6req/s|37327req/s|62513.17req/s|68573.03req/s|84805.13req/s|111732.57req/s|146403.47req/s
|go|20551.33req/s|38314.13req/s|55431.63req/s|66767.83req/s|80669.17req/s|108965.77req/s|161852.13req/s

							
#### `GET /user/:id`

|Framework|Concurrency 1|2|4|6|8|12|16
|---|---|---|---|---|---|---|---
|express|8805.07 req/s|9267.17 req/s|9191.93 req/s|9179.43 req/s|9164.9 req/s|9144.8 req/s|9142.43 req/s
|express-cluster|7951.67 req/s|16508.23 req/s|25358 req/s|27811.77 req/s|27519.47 req/s|33401.2 req/s|41366.3 req/s
|bandit|20707.9 req/s|31308.63 req/s|45332.47 req/s|58307.2 req/s|68275.43 req/s|87301.57 req/s|107105.7 req/s
|cowboy|19884.97 req/s|30350.73 req/s|54171.7 req/s|58189.17 req/s|68643.27 req/s|89929.47 req/s|109594.37 req/s
|mist|20990.93 req/s|31741.47 req/s|52588.97 req/s|62640.33 req/s|71829.6 req/s|92688.7 req/s|120267.03 req/s
|ewe|21631.1 req/s|35824.7 req/s|53838.03 req/s|64705.87 req/s|73291.7 req/s|102289.93 req/s|129006.33 req/s
|go|19772.03 req/s|38465.93 req/s|54049.13 req/s|63641.73 req/s|72757.53 req/s|102563.73 req/s|144941.8 req/s
							
#### `POST /user`

|Framework|Concurrency 1|2|4|6|8|12|16
|---|---|---|---|---|---|---|---
|express|12137.33 req/s|12576.37 req/s|12482.7 req/s|12208.4 req/s|11937.6 req/s|12137.07 req/s|12110.27 req/s
|express-cluster|9921.73 req/s|21332.43 req/s|28348.9 req/s|33581.93 req/s|34791.87 req/s|40195.43 req/s|58178.47 req/s
|bandit|18304.07 req/s|27906.5 req/s|40354.37 req/s|51985.77 req/s|59610.87 req/s|73520.97 req/s|87108.8 req/s
|cowboy|15957 req/s|20892.23 req/s|33816.87 req/s|44301.57 req/s|48355.63 req/s|62793.3 req/s|79075.3 req/s
|mist|18761.67 req/s|31251.33 req/s|49224.63 req/s|53077.8 req/s|63018.83 req/s|79021.6 req/s|101143.3 req/s
|ewe|19562.13 req/s|30995.63 req/s|47461.1 req/s|56096.17 req/s|66331.93 req/s|86865.23 req/s|104207.17 req/s
|go|17343.33 req/s|28013.37 req/s|37128.53 req/s|38905.5 req/s|35441.17 req/s|37029.2 req/s|41938.3 req/s

![GET /](/results/GET%20_.png)

![GET /user/:id](/results/GET%20_user_%20id.png)

![POST /user](/results/POST%20_user.png)
