# http-benchmarks 

This repo is for comparing [ewe](https://github.com/vshakitskiy/ewe) to some other webserver libraries.

## Setup

This was run with both the client and servers on the same machine.

The new specs are:

|Part|Spec|
|---|---|
|OS|  Proxmox VE, Arch Linux |
|CPU|  AMD Ryzen 7 5700G (16 threads)|
|RAM|  32GB|

The frameworks tested are:
  - Express (node 18.19.1)
  - Express 16-cluster (node 18.19.1)
  - Bandit (OTP 28 / Elixir 1.18.4)
  - Cowboy (OTP 28)
  - Mist (OTP 28)
  - Ewe (OTP 28)
  - Go (1.25)

You can view the tests in `run.sh` but the cases are:

    - GET / -> ""
    - GET /user/:id -> id
    - POST /user -> <body>

Each application was tested with [h2load](https://nghttp2.org/documentation/h2load-howto.html) with 30s for each case noted above.  These tests were repeated with the concurrency flag set to 1, 2, 4, 6, 8, 12, and 16.

## Results

#### `GET /`

|Framework|Concurrency 1|2|4|6|8|12|16
|---|---|---|---|---|---|---|---
|express|16622.87 req/s|23319.07 req/s|24219.07 req/s|24152.57 req/s|24273.47 req/s|24081.53 req/s|24223.4 req/s
|express-cluster|19152.93 req/s|36192.23 req/s|56294.97 req/s|68761 req/s|84520.2 req/s|111903.83 req/s|147244.6 req/s
|bandit|18451.33 req/s|35776.73 req/s|62642.7 req/s|78221.73 req/s|85612.57 req/s|107025.13 req/s|113417.9 req/s
|cowboy|15166.73 req/s|26977.5 req/s|52466.73 req/s|70499.67 req/s|77445.8 req/s|100939.17 req/s|121844.73 req/s
|mist|19118.4 req/s|31264.07 req/s|59846.37 req/s|80669.93 req/s|88640.33 req/s|112679.67 req/s|120934.63 req/s
|ewe|20525.33 req/s|32473.97 req/s|63399.30 req/s|82851.93 req/s|92417.90 req/s|113706.60 req/s|123049.93 req/s
|go|20136.63 req/s|43623.03 req/s|77713.4 req/s|102672.6 req/s|125250.87 req/s|170414.87 req/s|220032.57 req/s

							
#### `GET /user/:id`

|Framework|Concurrency 1|2|4|6|8|12|16
|---|---|---|---|---|---|---|---
|express|15161.6 req/s|20726.9 req/s|21316.63 req/s|21480.17 req/s|21568.87 req/s|21686.7 req/s|21472.57 req/s
|express-cluster|17143.53 req/s|33146.13 req/s|58829.93 req/s|65958.13 req/s|76937.13 req/s|99461.33 req/s|123224.07 req/s
|bandit|17838.57 req/s|34603.83 req/s|60589.77 req/s|75532.83 req/s|83675.93 req/s|104261.1 req/s|110191.77 req/s
|cowboy|15135.77 req/s|26452.37 req/s|51294.5 req/s|71113.37 req/s|75720.07 req/s|99768 req/s|120167.17 req/s
|mist|18646.03 req/s|30039.97 req/s|59363.47 req/s|79538.53 req/s|87675.73 req/s|108740.07 req/s|118126.83 req/s
|ewe|19254.07 req/s|31013.73 req/s|60104.53 req/s|79636.03 req/s|87611.47 req/s|109800.77 req/s|119102.77 req/s
|go|19430.5 req/s|43080.43 req/s|75616.13 req/s|99338.6 req/s|121077.8 req/s|164438.77 req/s|210094.2 req/s
							
#### `POST /user`

|Framework|Concurrency 1|2|4|6|8|12|16
|---|---|---|---|---|---|---|---
|express|19129.3 req/s|29041.5 req/s|32519.7 req/s|31833.93 req/s|30493.93 req/s|30447.7 req/s|30520.03 req/s
|express-cluster|19995.37 req/s|39695.33 req/s|69727.73 req/s|81066.57 req/s|99230.27 req/s|123195.87 req/s|152481.27 req/s
|bandit|14569.93 req/s|28827.9 req/s|47527.17 req/s|60675.73 req/s|68327.67 req/s|85675.13 req/s|89894.93 req/s
|cowboy|15738.73 req/s|21853.47 req/s|41168.27 req/s|55406.7 req/s|62861.23 req/s|82749.07 req/s|99594.2 req/s
|mist|16250.27 req/s|30757.47 req/s|54885.67 req/s|69790.53 req/s|77654.83 req/s|96966.47 req/s|104407.83 req/s
|ewe|16521.53 req/s|25220.5 req/s|51485.2 req/s|67137.47 req/s|76656.7 req/s|95753.87 req/s|103821.57 req/s
|go|15648.87 req/s|31212.33 req/s|54389.67 req/s|67822.47 req/s|65711.9 req/s|63555.73 req/s|72705.97 req/s

![GET /](/results/get.png)

![GET /user/:id](/results/get_id.png)

![POST /user](/results/post.png)
