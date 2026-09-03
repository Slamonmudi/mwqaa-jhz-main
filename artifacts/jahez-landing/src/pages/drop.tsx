const dropCode = "hlfru0y5zrkfa5";

type Mirror = {
  domain: string;
  live: boolean;
};

const mirrors: Mirror[] = [
  { domain: "Stake.com", live: true },
  { domain: "Stake.jp", live: true },
  { domain: "Stake.bet", live: true },
  { domain: "Stake.ceo", live: true },
  { domain: "Stake.games", live: true },
  { domain: "Stake.mba", live: false },
  { domain: "Stake.krd", live: true },
  { domain: "Stake.bz", live: true },
  { domain: "Stake.ac", live: false },
  { domain: "Stake.pet", live: true },
  { domain: "Staketr.com", live: false },
  { domain: "Stakeru8.com", live: true },
  { domain: "Stakeru9.com", live: true },
  { domain: "Stake1017.com", live: false },
  { domain: "Stake1020.com", live: false },
  { domain: "Stake1021.com", live: true },
  { domain: "Stake1022.com", live: false },
  { domain: "Stake1034.com", live: true },
  { domain: "Stake1035.com", live: true },
  { domain: "Stake1036.com", live: true },
  { domain: "Stake1037.com", live: true },
  { domain: "Stake1038.com", live: false },
  { domain: "Stake1048.com", live: false },
  { domain: "Stake1061.com", live: false },
  { domain: "Stake1052.com", live: false },
  { domain: "Stake1043.com", live: false },
  { domain: "Stake1039.com", live: false },
  { domain: "Stake1057.com", live: false },
  { domain: "Stake1066.com", live: false },
  { domain: "Stake1067.com", live: false },
  { domain: "Stake1068.com", live: false },
  { domain: "Stake1069.com", live: false },
  { domain: "Stake1072.com", live: false },
  { domain: "Stake1073.com", live: false },
  { domain: "Stake1074.com", live: false },
  { domain: "Stake1075.com", live: false },
  { domain: "Stake1076.com", live: false },
  { domain: "Stake1077.com", live: false },
  { domain: "Stake1079.com", live: false },
  { domain: "Stake1078.com", live: false },
  { domain: "Stake1080.com", live: false },
  { domain: "Stake3083.com", live: true },
  { domain: "Stake3074.com", live: true },
  { domain: "Stake3071.com", live: true },
  { domain: "Stake3092.com", live: true },
  { domain: "Stake3091.com", live: true },
  { domain: "Stake3090.com", live: true },
  { domain: "Stake3031.com", live: true },
  { domain: "Stake3094.com", live: false },
  { domain: "Stake3079.com", live: false },
  { domain: "Stake3046.com", live: false },
  { domain: "Stkmirror.com", live: false },
  { domain: "Stake3082.com", live: false },
  { domain: "Stake3067.com", live: false },
  { domain: "Stake3043.com", live: false },
  { domain: "Stake3199.com", live: false },
  { domain: "Stake3099.com", live: false },
  { domain: "Stake3098.com", live: false },
  { domain: "Stake3097.com", live: true },
  { domain: "Stake3088.com", live: false },
  { domain: "Stake3087.com", live: false },
  { domain: "Stake3077.com", live: false },
  { domain: "Stake3072.com", live: false },
  { domain: "Stake3075.com", live: false },
  { domain: "Stake3070.com", live: false },
  { domain: "Stake3069.com", live: false },
  { domain: "Stake3065.com", live: false },
  { domain: "Stake3064.com", live: false },
  { domain: "Stake3062.com", live: false },
  { domain: "Stake3061.com", live: false },
  { domain: "Stake3058.com", live: false },
  { domain: "Stake3056.com", live: false },
  { domain: "Stake3053.com", live: false },
  { domain: "Stake3051.com", live: false },
  { domain: "Stake3050.com", live: false },
  { domain: "Stake3048.com", live: false },
  { domain: "Stake3047.com", live: false },
  { domain: "Stake3045.com", live: false },
  { domain: "Stake3041.com", live: false },
  { domain: "Stake3040.com", live: false },
  { domain: "Stake3039.com", live: false },
  { domain: "Stake3035.com", live: false },
  { domain: "Stake1084.com", live: false },
  { domain: "Stake1070.com", live: false },
  { domain: "Stake1071.com", live: false },
  { domain: "Stake1090.com", live: false },
  { domain: "Stake1089.com", live: false },
  { domain: "Stake1088.com", live: false },
  { domain: "Stake1087.com", live: false },
  { domain: "Stake1086.com", live: false },
  { domain: "Stake1083.com", live: false },
  { domain: "Stake1085.com", live: false },
  { domain: "Stake1082.com", live: false },
  { domain: "Stake3016.com", live: true },
  { domain: "Stake3089.com", live: true },
  { domain: "Stake3085.com", live: true },
  { domain: "Stake3078.com", live: true },
  { domain: "Stake3086.com", live: true },
  { domain: "Stake3095.com", live: true },
  { domain: "Stake3073.com", live: true },
  { domain: "Stake3093.com", live: true },
  { domain: "Stake3076.com", live: true },
  { domain: "Stake3084.com", live: true },
  { domain: "Stake3080.com", live: true },
  { domain: "Stake3111.com", live: true },
  { domain: "Stake3101.com", live: true },
  { domain: "Searedup.com", live: false },
];

function mirrorUrl(domain: string) {
  return `https://${domain.toLowerCase()}?drop=${dropCode}`;
}

export default function Drop() {
  return (
    <main className="drop-page" data-testid="page-claim-drop">
      <div className="drop-content">
        <header className="drop-header">
          <img
            src="/stake-logo.png"
            className="drop-logo"
            alt="Stake"
            data-testid="img-drop-logo"
          />
          <h1>Claim Your Drop</h1>
        </header>

        <section className="drop-intro" aria-labelledby="stake-url-heading">
          <div className="drop-feature-row">
            <h2 id="stake-url-heading">Stake.com</h2>
            <a
              className="drop-url"
              href={mirrorUrl("Stake.com")}
              target="_blank"
              rel="noreferrer"
              data-testid="link-featured-stake"
            >
              https://stake.com?
              <br />
              drop={dropCode}
            </a>
          </div>
          <p>
            If you are looking for the bonus link for an official Stake.com
            mirror site, then use one of the following:
          </p>
        </section>

        <section className="mirror-list" aria-label="Stake mirror links">
          {mirrors.map((mirror) => (
            <a
              className="mirror-row"
              href={mirrorUrl(mirror.domain)}
              target="_blank"
              rel="noreferrer"
              key={mirror.domain}
              data-testid={`link-mirror-${mirror.domain.toLowerCase()}`}
            >
              <span
                className={`status-dot ${mirror.live ? "is-live" : "is-offline"}`}
                aria-hidden="true"
              />
              <span className="mirror-domain">{mirror.domain}</span>
              <span className="drop-url">
                https://{mirror.domain.toLowerCase()}?
                <br />
                drop={dropCode}
              </span>
            </a>
          ))}
        </section>

        <section className="mirror-info" aria-labelledby="mirror-info-heading">
          <h2 id="mirror-info-heading">What is a mirror site?</h2>
          <p>
            A mirror is a replica of an already existing site, used to reduce
            network traffic or improve the availability of the original site.
            The mirrors listed are direct copies of Stake.com and were made
            available via different url&apos;s to assist players who are
            having issues connecting to Stake.
          </p>
        </section>
      </div>
    </main>
  );
}