import { LitElement, html, css } from 'lit-element';
import { openWcLogo } from './open-wc-logo.js';

import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';
import './image-list-item.js';
import {default as fishList} from './fish-list.js';

const panfish_info = html`
    <ul class="compact-list"><li><strong>Species Name:</strong> <em>Pomoxis </em></li>
    <li><strong>Common Names:</strong> croppie, calico bass, speckled bass</li>
    <li><strong>State Record:</strong> 3 lbs. 8.5 oz. Caught in Lake Hortonia in 2005 by Francis T. Geoffrey.</li>
    </ul></div>

    <h3>Description</h3><p>A small, brightly colored sunfish that is representative of a group of fish called “panfish” which in Vermont includes bluegill, redbreast sunfish, rock bass and black and white crappie. Panfish rarely exceed 10 inches, but they are excellent eating, abundant and fun to catch for anglers of all ages.</p>
    <h3>Where to Fish</h3>
    <p>Many panfish species are found in lakes, ponds and rivers throughout Vermont. Common areas to find panfish include smaller, shallower ponds and lakes, as well as weedy coves and bays of larger lakes.</p>
    <p>A few of the more popular panfish waters include lakes Dunmore, Champlain, Bomoseen, St. Catherine, Morey and Fairlee, as well as Monkton Pond, Otter Creek and the Connecticut River.</p>
    <h3>How to Fish</h3>
    <p>Panfish typically relate to shallow cover such as submerged vegetation, sunken trees and underwater rock piles, and can be taken by anglers using worms or other types of small live bait, as well as with small artificial lures including flies, spinners, poppers, tube jigs and grubs.</p>
  `;

export class AppFish extends LitElement {
  constructor() {
    super();
    this.fishes = [
      {
        id: 'pomoxis_nigromaculatus',
        src: 'Small Black Crappie.jpg',
        title: 'Black Crappie',
        info: panfish_info,
        lures: [
          'Panther-Martin spinners, 1/32 or 1/16 oz',
          'Small spoons',
          'Small jigs',
          'Live bait'
        ]
      },
      {
        id: 'lepomis_macrochirus',
        src: 'Small Bluegill.jpg',
        title: 'Bluegill',
        info: panfish_info,
        lures: [
          'Panther-Martin spinners, 1/32 or 1/16 oz',
          'Small spoons',
          'Small jigs',
          'Live bait'
        ]
      },
      {
        id: 'lepomis_gibbosus',
        src: 'Small Sunfish.jpg',
        title: 'Sunfish',
        info: panfish_info,
        lures: [
          'Panther-Martin spinners, 1/32 or 1/16 oz',
          'Small spoons',
          'Small jigs',
          'Live bait'
        ]
      },
      {
        id: 'perca_flavescens',
        src: 'Small Yellow Perch.jpg',
        title: 'Yellow Perch',
        info: html`
          <ul class="compact-list"><li><strong>Species Name:</strong> <em>Perca flavescens</em></li>
          <li><strong>Common Names:</strong> perch, American perch, lake perch, ring-tail perch, ringed perch, striped perch</li>
          <li><strong>State Record:</strong> 2 lbs. 2 oz. Caught in Lake Champlain in 1981 by Sheldon C. Meaker, Jr.</li>
          </ul><h3>Description</h3>
          <p>One of Vermont’s favorite food dishes and common to waters throughout the state. A schooling fish, yellow perch have golden-yellow flanks with six to eight dark vertical bars and orange lower fins.</p>
          <h3>Where to Fish</h3>
          <p>Yellow perch, a preferred forage fish for walleye, northern pike and smallmouth bass, are abundant in many bodies of water across Vermont.</p>
          <p>Well-known yellow perch fisheries include lakes Champlain, Carmi, Morey, Bomoseen and Memphremagog, Chittenden and Harriman reservoirs, and Berlin Pond and Otter Creek, though many other small lakes and ponds sustain healthy populations of this species.</p>
          <h3>How to Fish</h3>
          <p>Yellow perch can be found relating to various types of aquatic habitat including submerged weed beds, shallow and deep rock structure, sunken trees, logs and stumps, and shoreline cover including overhanging trees and docks. Additionally, perch often hang around man-made cover such as bridge pilings and piers.</p>
          <p>One proven tip for locating perch around these types of cover is to find structure that is directly adjacent to deep water. Perch will often relate to quick, steep drops where deep water cuts close to underwater cover.</p>
          <p>Anglers typically succeed in targeting these aggressive feeders with live bait such as worms and small minnows, or with artificial lures like small grubs, tubes, flies and spinners.</p>
          <p>Yellow perch are the most popular target for Vermont’s winter anglers, who typically use small jigs tipped with maggots or perch-eyes to catch this abundant, tasty species.</p>
        `,
        lures: [
          'Panther-Martin spinners, 1/32 or 1/16 oz',
          'Small spoons',
          'Small jigs',
          'Live bait'
        ]
      },
      {
        id: 'salvelinus_fontinalus',
        src: 'Trophy Brook Trout.jpg',
        title: 'Brook Trout',
        info: html`
          <ul class="compact-list"><li><strong>Species Name:</strong> <em>Salvelinus fontinalus</em></li>
          <li><strong>Common Names:</strong> brookie, speckled trout, squaretail</li>
          <li><strong>State Record:</strong> 5 lbs. 12 oz. Caught in Paran Creek in 1977 by Dennis Harwood.</li>
          </ul><h3>Description</h3>
          <p>Vermont’s only native stream-dwelling trout. Actually a char, they have worm-like markings against a greenish back, and their flanks are covered with light yellowish spots.</p>
          <p>Small bright red spots surrounded by blue halos are also found along their lateral mid-section. Their light spots on a dark background distinguish them from brown and rainbow trout. Their tails are also not forked, hence the name "squaretail".</p>
          <h3>Where to Fish</h3>
          <p>One of Vermont’s most-widely dispersed fish, brook trout are found in coldwater fisheries throughout Vermont. They are intolerant of high water temperatures and are seldom found in waters above 68° F.</p>
          <p>Some of Vermont’s productive brook trout spots include the White, Cold, Mill, Mettawee, Deerfield and Ottauquechee rivers, though nearly every small, cold stream throughout the state supports a healthy population.</p>
          <h3>How to Fish</h3>
          <p>Like other members of the salmonidae family, brook trout can be successfully targeted with both live bait and artificial lures. Live bait selections such as earth worms, wax worms, crickets, small minnows, grasshoppers and fish eggs can all be effective choices for catching brook trout. On the artificial lure side, small spinners, minnow plugs, spoons and various floating and sinking flies are also proven lures.</p>
        `,
        lures: [
          'Upland: Panther-Martin spinners, 1/32oz',
          'Lakes & rivers: Panther-Martin spinners, 1/16 or 1/8 oz'
        ],
        notes: [
          'Requires cold, clean, well oxygenated, oligotrophic waters.',
          'Often found in pools in upland streams.',
          'Also found in riffles, but very easy to snag-up lures in riffles.',
          'Extremely line-shy. Fluorocarbon line or leader recommended.'
        ]
      },
      {
        id: 'salmo_trutta',
        src: 'Trophy Brown M Trout.jpg',
        title: 'Brown Trout Male',
        lures: [
          'Panther-Martin spinners, 1/16 or 1/8 oz'
        ]
      },
      {
        id: 'salmo_trutta',
        src: 'Trophy Brown Trout.jpg',
        title: 'Brown Trout',
        lures: [
          'Panther-Martin spinners, 1/16 or 1/8 oz'
        ]
      },
      // {
      //   src:  'Trophy King Salmon.jpg',
      //   title: 'King Salmon',
      // },
      {
        id: 'micropterus_salmoides',
        src:  'Trophy Largemouth.jpg',
        title: 'Largemouth Bass',
        lures: [
          'Texas-rigged Senko worm', 
          'Spinnerbait; black works well; fish it slow, just enough to get it to "thump"'
        ]
      },
      {
        id: 'esox_lucius',
        src:   'Trophy Northern Pike.jpg',
        title: 'Northern Pike',
        lures: [
          'Red and white Eppinger Dardevle, 1/4-1oz',
          'Texas-rigged Senko worm, 6"',
          '6" or longer black steel leader strongly recommended to avoid bite-offs'
        ]
      },
      {
        id: 'micropterus_dolemieui',
        src:  'Trophy Smallmouth.jpg',
        title: 'Smallmouth Bass',
        lures: [
          'Texas-rigged Senko worm, 6"',
          'Wacky-rigged Senko worm, 6"',
        ],
        notes: [
          'Can be line-shy; fluorocarbon leader recommended.',
          'To avoid gut-hooking, use the largest tackle possible for the fist you want to catch. I suggest 5/0 hooks and 6" senko worms. Set the hook early before the fish can swallow.',
          'The new "automatic" hook removers work well on gut-hooks.'
        ]
      },
      {
        id: 'oncorhynchus_mykiss',
        src:  'Trophy Steelhead.jpg',
        title: 'Steelhead Salmon',
        lures: [
          'Spinners, 1/8oz',
          'Spoons'
        ]
      },
      {
        id: 'oncorhynchus_mykiss',
        src:  'Trophy Strm Rainbow.jpg',
        title: 'Rainbow Trout',
        lures: [
          'Upland: Panther-Martin spinners, 1/32oz',
          'Lakes & rivers: Panther-Martin spinners, 1/16 or 1/8 oz'
        ]
      },
      {
        id: 'sander_vitreus',
        src:  'Trophy Walleye.jpg',
        title: 'Walleye',
        lures: [
          'Jigs',
          'Small plastic worms',
          'Live bait'
        ],
        notes: [
          'Walleye primarily feed at night'
        ]
      },
      {
        id: 'ameirus_nebulosus',
        title: 'Brown Bullhead',
        src: 'Brown_bullhead_fish_ameiurus_nebulosus.jpg'
      },
      {
        id: 'esox_niger',
        title: 'Chain Pickerel',
        src: 'Esox_niger.jpg'
      },
      {
        id: 'ambloplites_rupestris',
        title: 'Rock Bass',
        src: 'Rock_Bass.jpg'
      },
      {
        id: 'osmerus_mordax',
        title: 'Rainbow Smelt',
        src: '1200px-Osmerus_mordax rainbow smelt.jpg'
      },
    ];

    this.fishes = this.fishes.map(fish=>(
      {...fish, info: fish.info || fishList[fish.id]}
    ))
  }

  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }

      .image-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }

      image-list-item {
        flex-grow: 0;
      }
    `;
  }

  render() {
    return html`
        <div class=image-list>
          ${
            this.fishes.map(fish => html`
              <image-list-item 
                .src=${fish.src} 
                .title=${fish.title}
                .info=${fish.info}
                .description=${fish.description}
                .lures=${fish.lures}
                .tackle=${fish.tackle}
                .habitat=${fish.habitat}
              ></image-list-item>`)
          }
        </div>

        <p class="app-footer">
          &copy;2020 Jeff Laughlin
        </p>
    `;
  }
}
