/** Full lesson: Multimodality and Large Multimodal Models (LMMs).
 *  Part 1 context, Part 2 CLIP + Flamingo fundamentals, Part 3 research directions,
 *  plus a 2023-2026 update section. Index mirrors the source article's structure.
 */

export type LessonSubsection = { id: string; title: string };

export type LessonSection = {
  id: string;
  title: string;
  html: string;
  children?: LessonSubsection[];
};

export const agenticAiMultimodal = {
  slug: 'multimodal',
  title: 'Multimodality and Large Multimodal Models (LMMs): A Beginner-to-Advanced Guide',
  subtitle:
    'Why multimodality matters, how data modalities convert into one another, the two task families, then the fundamentals through CLIP and Flamingo — contrastive learning, joint embedding spaces, frozen encoders, cross-attention adapters — and where the field went next: native any-to-any models, video, robotics and multimodal outputs.',
  byline: 'Agentic AI track · Lesson 5 · ~2h 45m read · Beginner to Advanced',
  interviewTip:
    'Two questions separate people who have read about LMMs from people who understand them. First: why did CLIP use a contrastive objective instead of a language-model objective? (Because many different captions can legitimately describe one image, so predicting the exact text is a needlessly hard target — and it bought roughly a 12x efficiency gain.) Second: what exactly is frozen and what is trained in Flamingo, and why? (Frozen vision encoder and frozen LM layers; the Perceiver Resampler and gated cross-attention layers are trained — you buy multimodality without paying to retrain a language model.)',
  sections: [
    {
      id: 'part1',
      title: 'Part 1 · Understanding Multimodal',
      children: [
        { id: 'p1-what', title: 'What "multimodal" means (and what an LMM is)' },
        { id: 'p1-why', title: 'Why multimodal' },
        { id: 'p1-modalities', title: 'Data modalities' },
        { id: 'p1-tasks', title: 'Multimodal tasks' },
        { id: 'p1-generation', title: 'Generation' },
        { id: 'p1-vlu', title: 'Vision-language understanding' },
      ],
      html: `
        <p>For most of machine learning's history, a model lived in a single data mode. Text models did translation and language modelling. Image models did classification and detection. Audio models did speech recognition. Each had its own architectures, datasets and benchmarks.</p>
        <p>Natural intelligence does not work that way. You read, talk and see. You listen to music to relax and listen for odd noises to detect danger. Any system that has to operate in the real world needs to handle more than one modality — which is why OpenAI's GPT-4V system card described bringing additional modalities such as image input into LLMs as something many view as a key frontier in AI research.</p>

        <h3 class="lesson-subhead" id="p1-what">What "multimodal" means (and what an LMM is)</h3>
        <p>Adding modalities to a Large Language Model gives you a <strong>Large Multimodal Model (LMM)</strong>. But not every multimodal system is an LMM — text-to-image models like Midjourney, Stable Diffusion and DALL-E are multimodal and have no language model component at all.</p>
        <p>"Multimodal" can mean any of three things, and being precise about which one you mean prevents a lot of confused architecture discussions:</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 232" role="img" aria-label="Three senses of multimodal: different input and output modalities, multimodal inputs, and multimodal outputs">
            <defs>
              <marker id="ah-mm1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="228" height="128" rx="11" />
            <text class="dg-h" x="26" y="36">1 · CROSS-MODAL</text>
            <text class="dg-s" x="26" y="52">input and output differ</text>
            <rect class="dg-box b" x="26" y="62" width="66" height="30" rx="7" />
            <text class="dg-s" x="59" y="81" text-anchor="middle">text</text>
            <rect class="dg-box k" x="150" y="62" width="76" height="30" rx="7" />
            <text class="dg-s" x="188" y="81" text-anchor="middle">image</text>
            <path class="dg-line violet" d="M92 77 H146" marker-end="url(#ah-mm1)" />
            <rect class="dg-box k" x="26" y="102" width="66" height="30" rx="7" />
            <text class="dg-s" x="59" y="121" text-anchor="middle">image</text>
            <rect class="dg-box b" x="150" y="102" width="76" height="30" rx="7" />
            <text class="dg-s" x="188" y="121" text-anchor="middle">text</text>
            <path class="dg-line violet" d="M92 117 H146" marker-end="url(#ah-mm1)" />

            <rect class="dg-band g" x="252" y="16" width="228" height="128" rx="11" />
            <text class="dg-h" x="266" y="36">2 · MULTIMODAL INPUT</text>
            <text class="dg-s" x="266" y="52">consumes several at once</text>
            <rect class="dg-box b" x="266" y="62" width="62" height="26" rx="6" />
            <text class="dg-s" x="297" y="79" text-anchor="middle">text</text>
            <rect class="dg-box k" x="266" y="94" width="62" height="26" rx="6" />
            <text class="dg-s" x="297" y="111" text-anchor="middle">image</text>
            <rect class="dg-box p" x="380" y="72" width="86" height="40" rx="7" />
            <text class="dg-s" x="423" y="97" text-anchor="middle">one model</text>
            <path class="dg-line violet" d="M328 75 H360 V88 H376" marker-end="url(#ah-mm1)" />
            <path class="dg-line violet" d="M328 107 H360 V96 H376" marker-end="url(#ah-mm1)" />
            <text class="dg-s" x="266" y="134">← where most LMMs sit today</text>

            <rect class="dg-band o" x="492" y="16" width="216" height="128" rx="11" />
            <text class="dg-h" x="506" y="36">3 · MULTIMODAL OUTPUT</text>
            <text class="dg-s" x="506" y="52">emits several at once</text>
            <rect class="dg-box p" x="506" y="72" width="76" height="40" rx="7" />
            <text class="dg-s" x="544" y="97" text-anchor="middle">one model</text>
            <rect class="dg-box b" x="620" y="62" width="72" height="26" rx="6" />
            <text class="dg-s" x="656" y="79" text-anchor="middle">text</text>
            <rect class="dg-box k" x="620" y="94" width="72" height="26" rx="6" />
            <text class="dg-s" x="656" y="111" text-anchor="middle">image</text>
            <path class="dg-line violet" d="M582 88 H602 V75 H616" marker-end="url(#ah-mm1)" />
            <path class="dg-line violet" d="M582 96 H602 V107 H616" marker-end="url(#ah-mm1)" />
            <text class="dg-s" x="506" y="134">← still the least mature</text>

            <rect class="dg-band p" x="12" y="156" width="696" height="66" rx="11" />
            <text class="dg-h" x="26" y="176">MULTIMODAL ⊃ LMM</text>
            <rect class="dg-box p" x="26" y="184" width="320" height="30" rx="7" />
            <text class="dg-s" x="186" y="203" text-anchor="middle">LMM = has a language model (Flamingo, GPT-4V, LLaVA)</text>
            <rect class="dg-box" x="360" y="184" width="334" height="30" rx="7" />
            <text class="dg-s" x="527" y="203" text-anchor="middle">multimodal, not an LMM = Midjourney, Stable Diffusion, DALL-E, CLIP</text>
          </svg>
          <figcaption>Figure 1 — Three distinct meanings of "multimodal", plus the containment relationship that trips people up: every LMM is multimodal, but plenty of multimodal systems have no language model at all.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>Terminology warning.</strong> "Multimodal data" in statistics can mean a multimodal <em>distribution</em> — bimodal, for instance. That is a completely different concept from multimodal data in the sense used here.</div>
        <p>This lesson follows the structure of the article it is based on. Part 1 is context: why multimodality, what the modalities are, and what tasks exist. Part 2 is the fundamentals through two models — CLIP, which laid the foundation for much of what followed, and Flamingo, whose performance is what made people start talking about LMMs. Part 3 covers active research directions, including newer systems such as BLIP-2, LLaVA, LLaMA-Adapter V2 and LaVIN. A fourth part, added here, covers what has happened since.</p>

        <h3 class="lesson-subhead" id="p1-why">Why multimodal</h3>
        <p>Four reasons, in rough order of how often they decide a project.</p>
        <ul class="lesson-layers">
          <li><strong>Many use cases are simply impossible without it.</strong> Any industry whose data is natively a mixture — healthcare, robotics, e-commerce, retail, gaming — cannot be served by a text-only model. A clinical model that cannot look at the scan is not doing the job.</li>
          <li><strong>More modalities can improve performance.</strong> A model learning from both text and images has more to learn from than one restricted to either alone.</li>
          <li><strong>It makes for a more flexible interface.</strong> Ask by typing, by speaking, or by pointing your camera at the thing you are confused about — whichever suits the moment.</li>
          <li><strong>Accessibility.</strong> One of the most genuinely valuable applications: helping visually impaired people browse the internet and navigate the physical world.</li>
        </ul>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 264" role="img" aria-label="A healthcare multimodal pipeline in which surgical images, clinical text and patient photographs are each tokenised, concatenated and fed to one multitask model">
            <defs>
              <marker id="ah-hc" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-hc2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">ONE PATIENT, FOUR MODALITIES, ONE MODEL</text>
            <rect class="dg-box k" x="16" y="34" width="150" height="38" rx="8" />
            <text class="dg-s" x="91" y="50" text-anchor="middle">surgical images,</text>
            <text class="dg-s" x="91" y="64" text-anchor="middle">observations, actions</text>
            <rect class="dg-box b" x="16" y="84" width="150" height="38" rx="8" />
            <text class="dg-s" x="91" y="100" text-anchor="middle">clinical text</text>
            <text class="dg-s" x="91" y="114" text-anchor="middle">“developed heart failure…”</text>
            <rect class="dg-box g" x="16" y="134" width="150" height="38" rx="8" />
            <text class="dg-s" x="91" y="150" text-anchor="middle">patient photo</text>
            <text class="dg-s" x="91" y="164" text-anchor="middle">“what caused this rash?”</text>
            <rect class="dg-box y" x="16" y="184" width="150" height="38" rx="8" />
            <text class="dg-s" x="91" y="200" text-anchor="middle">waveforms / vitals</text>
            <text class="dg-s" x="91" y="214" text-anchor="middle">ECG traces</text>

            <rect class="dg-box c" x="212" y="34" width="104" height="188" rx="8" />
            <text class="dg-s" x="264" y="118" text-anchor="middle">per-modality</text>
            <text class="dg-s" x="264" y="132" text-anchor="middle">encoder →</text>
            <text class="dg-s" x="264" y="146" text-anchor="middle">token sequence</text>
            <path class="dg-line cyan" d="M166 53 H196 V120 H208" marker-end="url(#ah-hc)" />
            <path class="dg-line cyan" d="M166 103 H196 V126 H208" marker-end="url(#ah-hc)" />
            <path class="dg-line cyan" d="M166 153 H196 V132 H208" marker-end="url(#ah-hc)" />
            <path class="dg-line cyan" d="M166 203 H196 V138 H208" marker-end="url(#ah-hc)" />

            <rect class="dg-box i" x="360" y="80" width="120" height="96" rx="8" />
            <text class="dg-s" x="420" y="120" text-anchor="middle">concatenated</text>
            <text class="dg-s" x="420" y="134" text-anchor="middle">input sequence</text>
            <path class="dg-line violet" d="M316 128 H356" marker-end="url(#ah-hc2)" />

            <rect class="dg-box p" x="524" y="88" width="120" height="80" rx="8" />
            <text class="dg-t" x="584" y="120" text-anchor="middle">multimodal</text>
            <text class="dg-t" x="584" y="136" text-anchor="middle">multitask model</text>
            <path class="dg-line violet" d="M480 128 H520" marker-end="url(#ah-hc2)" />
            <text class="dg-s" x="336" y="196">masked / shifted target — trained to predict the next piece</text>
            <text class="dg-s" x="336" y="212">of any modality, which is what makes one model serve many tasks</text>
            <text class="dg-s" x="16" y="244">Conceptually after Acosta et al., “Multimodal biomedical AI”, Nature Medicine (2022) — the canonical illustration of why</text>
            <text class="dg-s" x="16" y="258">healthcare is the clearest case for multimodality: no single modality contains the answer.</text>
          </svg>
          <figcaption>Figure 2 — The healthcare pattern. Each modality gets an encoder, everything becomes one token sequence, and a single model is trained across tasks — the template that most modern LMMs still follow.</figcaption>
        </figure>
        <p>It is worth grounding this with what these systems can actually do. Published GPT-4V examples included reading a specific highlighted cell out of a dense results table and explaining what it meant, localising each person in a street photo and returning bounding-box coordinates plus the image dimensions, answering a clinical question about which wisdom tooth is hardest to remove from an X-ray, and counting objects in a photograph. Notice the range: document understanding, spatial grounding, domain reasoning, and plain perception — four different capabilities from one interface.</p>

        <h3 class="lesson-subhead" id="p1-modalities">Data modalities</h3>
        <p>The modalities are text, image, audio, tabular data and others. The crucial insight for anyone designing these systems is that <strong>one mode can be represented or approximated in another</strong> — which is why so much progress has come from converting everything into a sequence of tokens.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Conversion map showing how audio, speech, images, video, text and tables can each be represented in another modality, and how all formats reduce to bitstrings">
            <defs>
              <marker id="ah-cv" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-cv2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">EVERY MODALITY CAN WEAR ANOTHER'S CLOTHES</text>
            <rect class="dg-box y" x="16" y="32" width="118" height="30" rx="7" />
            <text class="dg-s" x="75" y="51" text-anchor="middle">audio</text>
            <rect class="dg-box k" x="212" y="32" width="150" height="30" rx="7" />
            <text class="dg-s" x="287" y="51" text-anchor="middle">image (mel spectrogram)</text>
            <path class="dg-line green" d="M134 47 H208" marker-end="url(#ah-cv)" />

            <rect class="dg-box y" x="16" y="70" width="118" height="30" rx="7" />
            <text class="dg-s" x="75" y="89" text-anchor="middle">speech</text>
            <rect class="dg-box b" x="212" y="70" width="150" height="30" rx="7" />
            <text class="dg-s" x="287" y="89" text-anchor="middle">text (transcript)</text>
            <path class="dg-line green" d="M134 85 H208" marker-end="url(#ah-cv)" />
            <text class="dg-s" x="374" y="89">⚠ loses volume, intonation, pauses</text>

            <rect class="dg-box k" x="16" y="108" width="118" height="30" rx="7" />
            <text class="dg-s" x="75" y="127" text-anchor="middle">image</text>
            <rect class="dg-box i" x="212" y="108" width="150" height="30" rx="7" />
            <text class="dg-s" x="287" y="127" text-anchor="middle">vector → token sequence</text>
            <path class="dg-line green" d="M134 123 H208" marker-end="url(#ah-cv)" />
            <text class="dg-s" x="374" y="127">← the trick every LMM relies on</text>

            <rect class="dg-box c" x="16" y="146" width="118" height="30" rx="7" />
            <text class="dg-s" x="75" y="165" text-anchor="middle">video</text>
            <rect class="dg-box k" x="212" y="146" width="150" height="30" rx="7" />
            <text class="dg-s" x="287" y="165" text-anchor="middle">images + audio</text>
            <path class="dg-line green" d="M134 161 H208" marker-end="url(#ah-cv)" />
            <text class="dg-s" x="374" y="161">⚠ models mostly ignore the audio —</text>
            <text class="dg-s" x="374" y="174">a severe limitation (88% of TikTok</text>
            <text class="dg-s" x="374" y="187">users say sound is essential)</text>

            <rect class="dg-box b" x="16" y="196" width="118" height="30" rx="7" />
            <text class="dg-s" x="75" y="215" text-anchor="middle">text</text>
            <rect class="dg-box k" x="212" y="196" width="150" height="30" rx="7" />
            <text class="dg-s" x="287" y="215" text-anchor="middle">image (a photo of it)</text>
            <path class="dg-line green" d="M134 211 H208" marker-end="url(#ah-cv)" />

            <rect class="dg-box g" x="16" y="234" width="118" height="30" rx="7" />
            <text class="dg-s" x="75" y="253" text-anchor="middle">data table</text>
            <rect class="dg-box k" x="212" y="234" width="150" height="30" rx="7" />
            <text class="dg-s" x="287" y="253" text-anchor="middle">chart, which is an image</text>
            <path class="dg-line green" d="M134 249 H208" marker-end="url(#ah-cv)" />

            <rect class="dg-box r" x="470" y="206" width="234" height="58" rx="8" />
            <text class="dg-t" x="587" y="228" text-anchor="middle">…and all of it is bitstrings</text>
            <text class="dg-s" x="587" y="245" text-anchor="middle">a model that learns from bytes could</text>
            <text class="dg-s" x="587" y="258" text-anchor="middle">learn from any modality at all</text>
            <path class="dg-line rose dash" d="M362 249 H466" marker-end="url(#ah-cv2)" />
          </svg>
          <figcaption>Figure 3 — The conversion map. The warnings matter as much as the arrows: every conversion is lossy, and treating video as a silent image sequence throws away information users consider essential.</figcaption>
        </figure>
        <p>Three observations about the individual modalities that shape how systems get built:</p>
        <ul>
          <li><strong>Audio is still treated mostly as a voice-based alternative to text.</strong> The dominant use cases remain speech recognition and speech synthesis; non-speech audio such as music generation is comparatively niche.</li>
          <li><strong>Image is the most versatile input format,</strong> because it can carry text, tabular data, audio (as spectrograms) and to some extent video. There is also far more visual data in the world than text — phones and webcams generate it constantly.</li>
          <li><strong>Text is the most powerful output format.</strong> A model that generates images can only generate images; a model that generates text can summarise, translate, reason, answer questions and write code.</li>
        </ul>
        <p>Modalities not covered here at all include graphs, 3D assets, and representations of smell and touch (haptics). For the rest of this lesson we will focus on images and text, since the lessons generalise reasonably well.</p>

        <h3 class="lesson-subhead" id="p1-tasks">Multimodal tasks</h3>
        <p>The clearest way into these systems is through the tasks they were built for. The literature usually splits vision-language tasks into two groups: <strong>generation</strong>, and <strong>vision-language understanding (VLU)</strong> as the umbrella for everything that does not require generation. The boundary is genuinely blurry — generating a good answer requires understanding — but the split is useful.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 258" role="img" aria-label="Taxonomy of vision-language tasks split into generation and vision-language understanding with their sub-tasks">
            <defs>
              <marker id="ah-tx" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box p" x="284" y="14" width="152" height="34" rx="8" />
            <text class="dg-t" x="360" y="36" text-anchor="middle">Vision-language tasks</text>

            <rect class="dg-box o" x="98" y="72" width="180" height="34" rx="8" />
            <text class="dg-t" x="188" y="94" text-anchor="middle">Generation</text>
            <rect class="dg-box b" x="442" y="72" width="180" height="34" rx="8" />
            <text class="dg-t" x="532" y="94" text-anchor="middle">Understanding (VLU)</text>
            <path class="dg-line violet" d="M330 48 V60 H188 V68" marker-end="url(#ah-tx)" />
            <path class="dg-line violet" d="M390 48 V60 H532 V68" marker-end="url(#ah-tx)" />

            <rect class="dg-box y" x="16" y="130" width="150" height="52" rx="8" />
            <text class="dg-s" x="91" y="148" text-anchor="middle">image generation</text>
            <text class="dg-s" x="91" y="162" text-anchor="middle">text-to-image synthesis</text>
            <text class="dg-s" x="91" y="176" text-anchor="middle">DALL-E · SD · Midjourney</text>
            <rect class="dg-box k" x="182" y="130" width="164" height="52" rx="8" />
            <text class="dg-s" x="264" y="148" text-anchor="middle">text generation</text>
            <text class="dg-s" x="264" y="162" text-anchor="middle">visual question answering</text>
            <text class="dg-s" x="264" y="176" text-anchor="middle">image captioning</text>
            <path class="dg-line violet" d="M160 106 V120 H91 V126" marker-end="url(#ah-tx)" />
            <path class="dg-line violet" d="M216 106 V120 H264 V126" marker-end="url(#ah-tx)" />

            <rect class="dg-box c" x="376" y="130" width="150" height="52" rx="8" />
            <text class="dg-s" x="451" y="148" text-anchor="middle">classification</text>
            <text class="dg-s" x="451" y="162" text-anchor="middle">fixed class list</text>
            <text class="dg-s" x="451" y="176" text-anchor="middle">OCR, tagging</text>
            <rect class="dg-box g" x="542" y="130" width="162" height="52" rx="8" />
            <text class="dg-s" x="623" y="148" text-anchor="middle">retrieval</text>
            <text class="dg-s" x="623" y="162" text-anchor="middle">image→text and</text>
            <text class="dg-s" x="623" y="176" text-anchor="middle">text→image (image search)</text>
            <path class="dg-line violet" d="M500 106 V120 H451 V126" marker-end="url(#ah-tx)" />
            <path class="dg-line violet" d="M566 106 V120 H623 V126" marker-end="url(#ah-tx)" />

            <rect class="dg-band" x="12" y="200" width="696" height="50" rx="10" />
            <text class="dg-s" x="26" y="220">Outputs of generative tasks can be unimodal (text, image, 3D render) or multimodal. Unimodal output is the norm today;</text>
            <text class="dg-s" x="26" y="238">multimodal output is still taking shape — covered at the end of this lesson.</text>
          </svg>
          <figcaption>Figure 4 — The task taxonomy. Everything in Part 2 exists to serve one of these four leaves, and CLIP's real achievement was serving three of them with one embedding space.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="p1-generation">Generation</h3>
        <p><strong>Image generation (text-to-image synthesis)</strong> is the straightforward category: DALL-E, Stable Diffusion, Midjourney.</p>
        <p><strong>Text generation</strong> covers two workhorse tasks:</p>
        <ul class="lesson-layers">
          <li><strong>Visual question answering.</strong> Instead of text-only context, the model gets text and images together — so you can point a camera at something and ask "my car won't start, what's wrong with it?", "how do I make this dish?" or "what is this meme about?"</li>
          <li><strong>Image captioning,</strong> which quietly powers text-based image retrieval. An organisation may hold millions of images — products, graphs, designs, team photos, marketing assets — and automatically generated captions and metadata make them findable.</li>
        </ul>

        <h3 class="lesson-subhead" id="p1-vlu">Vision-language understanding</h3>
        <p>Two task types are worth zooming into: classification and text-based image retrieval.</p>
        <p><strong>Classification</strong> models can only output something from a predetermined list of classes, which is fine when you care about a fixed set of outcomes — an OCR system only needs to decide which known character it is looking at.</p>
        <p>That OCR example has a nice implication: because OCR works at the character level, pairing it with a system that understands broader context is what lets you "talk to" a textbook, a contract or a set of assembly instructions. Document processing is one of the highest-value LMM applications, and also one where mistakes are easy to miss — published GPT-4V document examples included errors that a careless reader would have accepted.</p>
        <p>A closely related task is <strong>image-to-text retrieval</strong>: given an image and a pool of predefined texts, find the text most likely to accompany it. Useful for product image search — retrieving the reviews that match a photograph.</p>
        <p><strong>Text-based image retrieval</strong> (image search, sometimes called text-to-image retrieval) matters both for search engines and for enterprises searching their own images and documents. There are two main approaches:</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 226" role="img" aria-label="Two approaches to text-based image retrieval: caption-and-match versus a joint embedding space">
            <defs>
              <marker id="ah-tb" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-tb2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band o" x="12" y="16" width="696" height="90" rx="11" />
            <text class="dg-h" x="26" y="36">APPROACH 1 · CAPTION EVERYTHING, THEN MATCH TEXT TO TEXT</text>
            <rect class="dg-box o" x="26" y="46" width="118" height="46" rx="7" />
            <text class="dg-s" x="85" y="65" text-anchor="middle">images</text>
            <text class="dg-s" x="85" y="79" text-anchor="middle">millions of them</text>
            <rect class="dg-box y" x="180" y="46" width="140" height="46" rx="7" />
            <text class="dg-s" x="250" y="65" text-anchor="middle">captions + metadata</text>
            <text class="dg-s" x="250" y="79" text-anchor="middle">manual or generated</text>
            <rect class="dg-box b" x="356" y="46" width="140" height="46" rx="7" />
            <text class="dg-s" x="426" y="65" text-anchor="middle">text query</text>
            <text class="dg-s" x="426" y="79" text-anchor="middle">matched against them</text>
            <rect class="dg-box" x="532" y="46" width="162" height="46" rx="7" />
            <text class="dg-s" x="613" y="65" text-anchor="middle">⚠ quality is capped by</text>
            <text class="dg-s" x="613" y="79" text-anchor="middle">what the caption mentions</text>
            <path class="dg-line rose" d="M144 69 H176" marker-end="url(#ah-tb)" />
            <path class="dg-line rose" d="M320 69 H352" marker-end="url(#ah-tb)" />
            <path class="dg-line rose dash" d="M496 69 H528" marker-end="url(#ah-tb)" />

            <rect class="dg-band g" x="12" y="118" width="696" height="98" rx="11" />
            <text class="dg-h" x="26" y="138">APPROACH 2 · ONE JOINT EMBEDDING SPACE FOR BOTH MODALITIES</text>
            <rect class="dg-box g" x="26" y="148" width="118" height="30" rx="7" />
            <text class="dg-s" x="85" y="167" text-anchor="middle">image encoder</text>
            <rect class="dg-box b" x="26" y="182" width="118" height="26" rx="7" />
            <text class="dg-s" x="85" y="199" text-anchor="middle">text encoder</text>
            <rect class="dg-box i" x="180" y="152" width="140" height="52" rx="7" />
            <text class="dg-s" x="250" y="173" text-anchor="middle">shared embedding</text>
            <text class="dg-s" x="250" y="187" text-anchor="middle">space</text>
            <rect class="dg-box p" x="356" y="152" width="140" height="52" rx="7" />
            <text class="dg-s" x="426" y="173" text-anchor="middle">nearest neighbours</text>
            <text class="dg-s" x="426" y="187" text-anchor="middle">in a vector DB</text>
            <rect class="dg-box l" x="532" y="152" width="162" height="52" rx="7" />
            <text class="dg-s" x="613" y="173" text-anchor="middle">✓ more flexible, and the</text>
            <text class="dg-s" x="613" y="187" text-anchor="middle">approach CLIP made possible</text>
            <path class="dg-line green" d="M144 163 H162 V172 H176" marker-end="url(#ah-tb2)" />
            <path class="dg-line green" d="M144 195 H162 V184 H176" marker-end="url(#ah-tb2)" />
            <path class="dg-line green" d="M320 178 H352" marker-end="url(#ah-tb2)" />
            <path class="dg-line green" d="M496 178 H528" marker-end="url(#ah-tb2)" />
          </svg>
          <figcaption>Figure 5 — Two routes to image search. The second is the more flexible and the more widely used, and it needs exactly one thing: a strong joint embedding space for vision and language. Which is what CLIP built.</figcaption>
        </figure>
      `,
    },
    {
      id: 'part2-clip',
      title: 'Part 2 · CLIP: Contrastive Language-Image Pre-training',
      children: [
        { id: 'p2-components', title: 'The three components of any multimodal system' },
        { id: 'clip-why', title: 'Why CLIP mattered' },
        { id: 'clip-arch', title: "CLIP's high-level architecture" },
        { id: 'clip-supervision', title: 'Natural language supervision' },
        { id: 'clip-contrastive', title: 'Contrastive learning' },
        { id: 'clip-obj-classifier', title: 'Classifier objective' },
        { id: 'clip-obj-lm', title: 'Language model objective' },
        { id: 'clip-obj-contrastive', title: 'Contrastive objective' },
        { id: 'clip-apps', title: 'CLIP applications' },
      ],
      html: `
        <p>With so many impressive multimodal systems to choose from, the two worth studying closely are <strong>CLIP (2021)</strong> and <strong>Flamingo (2022)</strong> — both for their significance and because their public details are unusually clear.</p>
        <ul class="lesson-layers">
          <li><strong>CLIP</strong> was the first model that could generalise to many image classification tasks with zero-shot and few-shot learning.</li>
          <li><strong>Flamingo</strong> was not the first large multimodal model to generate open-ended responses — Salesforce's BLIP arrived three months earlier — but its performance was strong enough that some called it the GPT-3 moment for multimodality.</li>
        </ul>
        <p>Both are old by the standards of this field, and many of their techniques are still in use. Learn them and newer systems become variations rather than mysteries.</p>

        <h3 class="lesson-subhead" id="p2-components">The three components of any multimodal system</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 212" role="img" aria-label="Generic multimodal system: per-modality encoders, an alignment step into a shared embedding space, and optionally a language model for generation">
            <defs>
              <marker id="ah-gen" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">1 · ENCODE</text>
            <text class="dg-h" x="266" y="22">2 · ALIGN</text>
            <text class="dg-h" x="500" y="22">3 · GENERATE (optional)</text>
            <rect class="dg-box k" x="16" y="34" width="120" height="36" rx="8" />
            <text class="dg-s" x="76" y="56" text-anchor="middle">image encoder</text>
            <rect class="dg-box b" x="16" y="80" width="120" height="36" rx="8" />
            <text class="dg-s" x="76" y="102" text-anchor="middle">text encoder</text>
            <rect class="dg-box y" x="16" y="126" width="120" height="36" rx="8" />
            <text class="dg-s" x="76" y="148" text-anchor="middle">audio encoder…</text>
            <rect class="dg-box i" x="266" y="62" width="150" height="72" rx="9" />
            <text class="dg-t" x="341" y="90" text-anchor="middle">shared multimodal</text>
            <text class="dg-t" x="341" y="106" text-anchor="middle">embedding space</text>
            <text class="dg-s" x="341" y="124" text-anchor="middle">this is CLIP's contribution</text>
            <path class="dg-line blue" d="M136 52 H228 V88 H262" marker-end="url(#ah-gen)" />
            <path class="dg-line blue" d="M136 98 H228 V98 H262" marker-end="url(#ah-gen)" />
            <path class="dg-line blue" d="M136 144 H228 V108 H262" marker-end="url(#ah-gen)" />
            <rect class="dg-box p" x="500" y="62" width="152" height="72" rx="9" />
            <text class="dg-t" x="576" y="90" text-anchor="middle">language model</text>
            <text class="dg-s" x="576" y="107" text-anchor="middle">conditioned on text</text>
            <text class="dg-s" x="576" y="121" text-anchor="middle">AND visuals</text>
            <path class="dg-line blue" d="M416 98 H496" marker-end="url(#ah-gen)" />
            <text class="dg-s" x="458" y="152" text-anchor="middle">← Flamingo adds this</text>
            <rect class="dg-band g" x="12" y="164" width="696" height="42" rx="10" />
            <text class="dg-s" x="26" y="184">Design principle: pretrain and reuse as many of these components as possible. Every efficiency advance in Part 3</text>
            <text class="dg-s" x="26" y="199">comes from freezing more of the stack and training only a small bridge between the frozen parts.</text>
          </svg>
          <figcaption>Figure 6 — The universal recipe. Component 2 is where CLIP lives, component 3 is where Flamingo lives, and the bottom band is the thesis of the entire field since.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="clip-why">Why CLIP mattered</h3>
        <p>CLIP's key contribution was mapping two modalities — text and images — into a <strong>shared embedding space</strong>, which makes text-to-image and image-to-text tasks dramatically easier: once both live in one space, "find the image matching this sentence" is a nearest-neighbour lookup.</p>
        <p>Training that space also produced a very strong image encoder, which is arguably the bigger legacy. It gave CLIP competitive zero-shot performance across many classification tasks, and that encoder went on to serve image generation, visual question answering and image retrieval. Flamingo and LLaVA both use CLIP as their image encoder; DALL-E used CLIP to rerank generated images. Whether GPT-4V uses CLIP is not public.</p>
        <p>Two techniques made it work — <strong>natural language supervision</strong>, which let them scale the data, and <strong>contrastive learning</strong>, which made training efficient.</p>

        <h3 class="lesson-subhead" id="clip-arch">CLIP's high-level architecture</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 250" role="img" aria-label="CLIP architecture with an image encoder and text encoder, projection matrices into a joint space, and a similarity matrix trained to maximise the diagonal">
            <defs>
              <marker id="ah-cl1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-cl3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box k" x="16" y="40" width="110" height="44" rx="8" />
            <text class="dg-s" x="71" y="59" text-anchor="middle">image</text>
            <text class="dg-s" x="71" y="73" text-anchor="middle">336×336 px</text>
            <rect class="dg-box k" x="146" y="40" width="120" height="44" rx="8" />
            <text class="dg-s" x="206" y="59" text-anchor="middle">image encoder</text>
            <text class="dg-s" x="206" y="73" text-anchor="middle">ViT-L/14 (or ResNet)</text>
            <rect class="dg-box c" x="286" y="40" width="96" height="44" rx="8" />
            <text class="dg-s" x="334" y="59" text-anchor="middle">V_i then</text>
            <text class="dg-s" x="334" y="73" text-anchor="middle">W_v · V_i</text>
            <path class="dg-line cyan" d="M126 62 H142" marker-end="url(#ah-cl1)" />
            <path class="dg-line cyan" d="M266 62 H282" marker-end="url(#ah-cl1)" />

            <rect class="dg-box b" x="16" y="150" width="110" height="44" rx="8" />
            <text class="dg-s" x="71" y="169" text-anchor="middle">text</text>
            <text class="dg-s" x="71" y="183" text-anchor="middle">the caption</text>
            <rect class="dg-box b" x="146" y="150" width="120" height="44" rx="8" />
            <text class="dg-s" x="206" y="169" text-anchor="middle">text encoder</text>
            <text class="dg-s" x="206" y="183" text-anchor="middle">GPT-2-like, 63M params</text>
            <rect class="dg-box c" x="286" y="150" width="96" height="44" rx="8" />
            <text class="dg-s" x="334" y="169" text-anchor="middle">L_i then</text>
            <text class="dg-s" x="334" y="183" text-anchor="middle">W_l · L_i</text>
            <path class="dg-line cyan" d="M126 172 H142" marker-end="url(#ah-cl1)" />
            <path class="dg-line cyan" d="M266 172 H282" marker-end="url(#ah-cl1)" />

            <rect class="dg-box i" x="416" y="86" width="128" height="62" rx="9" />
            <text class="dg-t" x="480" y="110" text-anchor="middle">joint embedding</text>
            <text class="dg-t" x="480" y="126" text-anchor="middle">space</text>
            <text class="dg-s" x="480" y="141" text-anchor="middle">cosine similarity lives here</text>
            <path class="dg-line cyan" d="M382 66 H400 V104 H412" marker-end="url(#ah-cl1)" />
            <path class="dg-line cyan" d="M382 168 H400 V130 H412" marker-end="url(#ah-cl1)" />

            <rect class="dg-box g" x="584" y="72" width="120" height="90" rx="9" />
            <text class="dg-t" x="644" y="98" text-anchor="middle">N × N similarity</text>
            <text class="dg-s" x="644" y="116" text-anchor="middle">maximise the N on</text>
            <text class="dg-s" x="644" y="130" text-anchor="middle">the diagonal, minimise</text>
            <text class="dg-s" x="644" y="144" text-anchor="middle">the N²−N off it</text>
            <path class="dg-line green" d="M544 117 H580" marker-end="url(#ah-cl3)" />

            <text class="dg-h" x="16" y="24">BOTH ENCODERS AND BOTH PROJECTION MATRICES ARE TRAINED JOINTLY, FROM SCRATCH</text>
            <rect class="dg-band c" x="12" y="206" width="696" height="40" rx="10" />
            <text class="dg-s" x="26" y="226">Best model: ViT-L/14@336px — a large vision transformer, images split into 14×14 pixel patches, 336×336 input.</text>
            <text class="dg-s" x="26" y="240">Performance proved far less sensitive to the text encoder's capacity, which is why the text side stayed small.</text>
          </svg>
          <figcaption>Figure 7 — CLIP's architecture. "CLIP embeddings" ambiguously means either the joint multimodal embeddings or the output of the image encoder alone — worth clarifying whenever someone says it.</figcaption>
        </figure>
        <p>For the image encoder the authors tried both ResNet and ViT; the best performer was <code>ViT-L/14@336px</code> — a large vision transformer, images divided into 14×14 pixel patches, at 336×336 input resolution. For text they used a Transformer similar to GPT-2 but smaller, the base model having 63M parameters and 8 attention heads.</p>
        <p>Embeddings from both encoders are projected into the same space by two projection matrices. Given an image embedding <code>V_i</code>, its multimodal embedding is <code>W_v · V_i</code>; given a text embedding <code>L_i</code>, it is <code>W_l · L_i</code>. Everything — both encoders and both projections — is trained jointly from scratch.</p>

        <h3 class="lesson-subhead" id="clip-supervision">Natural language supervision</h3>
        <p>For years, image models were trained on manually annotated (image, text) datasets like ImageNet and MS COCO. That does not scale: annotation is slow and expensive. The CLIP authors judged that no existing (image, text) dataset was both large and clean enough, so they built one of <strong>400 million pairs</strong>.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 202" role="img" aria-label="CLIP dataset construction: build 500,000 queries, match images, pair each with co-occurring text, cap per query, yielding 400 million pairs">
            <defs>
              <marker id="ah-ds" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">DATASET CONSTRUCTION — NO HUMAN ANNOTATION ANYWHERE IN THIS PIPELINE</text>
            <rect class="dg-box b" x="16" y="34" width="140" height="60" rx="8" />
            <text class="dg-s" x="86" y="54" text-anchor="middle">1 · 500,000 queries</text>
            <text class="dg-s" x="86" y="70" text-anchor="middle">common words, bigrams,</text>
            <text class="dg-s" x="86" y="84" text-anchor="middle">popular Wikipedia titles</text>
            <rect class="dg-box c" x="176" y="34" width="140" height="60" rx="8" />
            <text class="dg-s" x="246" y="54" text-anchor="middle">2 · match images</text>
            <text class="dg-s" x="246" y="70" text-anchor="middle">string / substring match,</text>
            <text class="dg-s" x="246" y="84" text-anchor="middle">not via a search engine</text>
            <rect class="dg-box g" x="336" y="34" width="150" height="60" rx="8" />
            <text class="dg-s" x="411" y="54" text-anchor="middle">3 · pair with co-occurring</text>
            <text class="dg-s" x="411" y="70" text-anchor="middle">text — captions, comments,</text>
            <text class="dg-s" x="411" y="84" text-anchor="middle">not the query itself</text>
            <rect class="dg-box y" x="506" y="34" width="120" height="60" rx="8" />
            <text class="dg-s" x="566" y="54" text-anchor="middle">4 · cap at 20K</text>
            <text class="dg-s" x="566" y="70" text-anchor="middle">images per query</text>
            <text class="dg-s" x="566" y="84" text-anchor="middle">to limit imbalance</text>
            <path class="dg-line violet" d="M156 64 H172" marker-end="url(#ah-ds)" />
            <path class="dg-line violet" d="M316 64 H332" marker-end="url(#ah-ds)" />
            <path class="dg-line violet" d="M486 64 H502" marker-end="url(#ah-ds)" />
            <rect class="dg-box p" x="256" y="122" width="208" height="42" rx="9" />
            <text class="dg-t" x="360" y="140" text-anchor="middle">400,000,000 (image, text) pairs</text>
            <text class="dg-s" x="360" y="156" text-anchor="middle">supervision that came free with the internet</text>
            <path class="dg-line violet thick" d="M566 94 V112 H360 V118" marker-end="url(#ah-ds)" />
            <text class="dg-s" x="16" y="186">Why pair with co-occurring text rather than the query? Because queries are too short to be descriptive — the caption carries the signal.</text>
          </svg>
          <figcaption>Figure 8 — Natural language supervision. The insight is that the internet had already labelled its own images, in the form of captions and comments sitting next to them.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="clip-contrastive">Contrastive learning</h3>
        <p>Before CLIP, vision-language models were trained with either a classifier objective or a language model objective. The contrastive objective is what let CLIP scale and generalise. The cleanest way to see why is to compare all three on the same task: given an image, produce text describing it.</p>

        <h4 class="lesson-subhead4" id="clip-obj-classifier">Classifier objective</h4>
        <p>A classifier picks the correct class from a predetermined list, which only works when the output space is finite. Every earlier model trained on (image, text) pairs inherited that limit — models on ILSVRC-2012 were confined to 1,000 classes, and JFT-300M to 18,291.</p>
        <p>This caps two things at once: the model's ability to say anything meaningful, and its capacity for zero-shot learning. Train it on ten classes and it cannot address a task with a hundred.</p>

        <h4 class="lesson-subhead4" id="clip-obj-lm">Language model objective</h4>
        <p>Where a classifier emits exactly one class, a language model emits a <em>sequence</em> of classes. Each item in the sequence is a token, drawn from a predetermined vocabulary. That is vastly more expressive — but also, the CLIP authors found, harder to train.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 234" role="img" aria-label="Three training objectives compared: classifier picks one class, language model emits a token sequence, contrastive ranks which text belongs to which image">
            <defs>
              <marker id="ah-ob" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="228" height="200" rx="11" />
            <text class="dg-h" x="26" y="36">CLASSIFIER</text>
            <rect class="dg-box k" x="26" y="46" width="80" height="30" rx="6" />
            <text class="dg-s" x="66" y="65" text-anchor="middle">image</text>
            <rect class="dg-box r" x="130" y="46" width="96" height="30" rx="6" />
            <text class="dg-s" x="178" y="65" text-anchor="middle">“dog” (1 of 1,000)</text>
            <path class="dg-line blue" d="M106 61 H126" marker-end="url(#ah-ob)" />
            <text class="dg-s" x="26" y="98">Output space is finite.</text>
            <text class="dg-s" x="26" y="116">Trained on 10 classes →</text>
            <text class="dg-s" x="26" y="130">useless on 100 classes.</text>
            <text class="dg-s" x="26" y="152">✗ no zero-shot</text>
            <text class="dg-s" x="26" y="170">✗ cannot describe</text>
            <text class="dg-s" x="26" y="188">✓ simple, cheap</text>

            <rect class="dg-band o" x="252" y="16" width="228" height="200" rx="11" />
            <text class="dg-h" x="266" y="36">LANGUAGE MODEL</text>
            <rect class="dg-box k" x="266" y="46" width="70" height="30" rx="6" />
            <text class="dg-s" x="301" y="65" text-anchor="middle">image</text>
            <rect class="dg-box o" x="360" y="46" width="106" height="30" rx="6" />
            <text class="dg-s" x="413" y="65" text-anchor="middle">“a dog on grass”</text>
            <path class="dg-line blue" d="M336 61 H356" marker-end="url(#ah-ob)" />
            <text class="dg-s" x="266" y="98">A sequence of tokens</text>
            <text class="dg-s" x="266" y="112">from a vocabulary.</text>
            <text class="dg-s" x="266" y="134">✓ flexible output</text>
            <text class="dg-s" x="266" y="152">✗ hard to train: it must</text>
            <text class="dg-s" x="266" y="166">produce the exact text,</text>
            <text class="dg-s" x="266" y="180">though many texts are</text>
            <text class="dg-s" x="266" y="194">equally valid</text>

            <rect class="dg-band g" x="492" y="16" width="216" height="200" rx="11" />
            <text class="dg-h" x="506" y="36">CONTRASTIVE</text>
            <rect class="dg-box k" x="506" y="46" width="66" height="30" rx="6" />
            <text class="dg-s" x="539" y="65" text-anchor="middle">image</text>
            <rect class="dg-box g" x="596" y="46" width="98" height="30" rx="6" />
            <text class="dg-s" x="645" y="65" text-anchor="middle">which text fits?</text>
            <path class="dg-line blue" d="M572 61 H592" marker-end="url(#ah-ob)" />
            <text class="dg-s" x="506" y="98">Not “generate the text” but</text>
            <text class="dg-s" x="506" y="112">“is this text likelier than</text>
            <text class="dg-s" x="506" y="126">those other texts?”</text>
            <text class="dg-s" x="506" y="148">✓ tolerant of many valid</text>
            <text class="dg-s" x="506" y="162">captions per image</text>
            <text class="dg-s" x="506" y="180">✓ ~12× more efficient than</text>
            <text class="dg-s" x="506" y="194">the LM baseline</text>
          </svg>
          <figcaption>Figure 9 — The three objectives. The contrastive column wins by asking an easier question that still teaches the model what it needs to know.</figcaption>
        </figure>

        <h4 class="lesson-subhead4" id="clip-obj-contrastive">Contrastive objective</h4>
        <p>The authors' hypothesis for why the language model objective struggled: the model is asked to generate <em>exactly</em> the text accompanying each image, when in truth many texts could accompany it — alt-text, caption, comments. In Flickr30K each image carries five human-written captions, and captions for the same image can differ wildly.</p>
        <p>Contrastive learning sidesteps this. Instead of predicting the exact text, CLIP is trained to predict <strong>whether a text is more likely to accompany an image than other texts are</strong>.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Contrastive batch as an N by N similarity matrix, with the diagonal maximised and off-diagonal minimised, read as two symmetric retrieval classification tasks">
            <defs>
              <marker id="ah-ct" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-ct2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">ONE BATCH · N = 32,768 PAIRS · N² SIMILARITY SCORES</text>
            <text class="dg-s" x="30" y="46">L₁</text>
            <text class="dg-s" x="78" y="46">L₂</text>
            <text class="dg-s" x="126" y="46">L₃</text>
            <text class="dg-s" x="174" y="46">L₄</text>
            <text class="dg-s" x="6" y="70">V₁</text>
            <text class="dg-s" x="6" y="106">V₂</text>
            <text class="dg-s" x="6" y="142">V₃</text>
            <text class="dg-s" x="6" y="178">V₄</text>
            <rect class="dg-box g" x="20" y="54" width="40" height="26" rx="4" />
            <rect class="dg-box r" x="68" y="54" width="40" height="26" rx="4" />
            <rect class="dg-box r" x="116" y="54" width="40" height="26" rx="4" />
            <rect class="dg-box r" x="164" y="54" width="40" height="26" rx="4" />
            <rect class="dg-box r" x="20" y="90" width="40" height="26" rx="4" />
            <rect class="dg-box g" x="68" y="90" width="40" height="26" rx="4" />
            <rect class="dg-box r" x="116" y="90" width="40" height="26" rx="4" />
            <rect class="dg-box r" x="164" y="90" width="40" height="26" rx="4" />
            <rect class="dg-box r" x="20" y="126" width="40" height="26" rx="4" />
            <rect class="dg-box r" x="68" y="126" width="40" height="26" rx="4" />
            <rect class="dg-box g" x="116" y="126" width="40" height="26" rx="4" />
            <rect class="dg-box r" x="164" y="126" width="40" height="26" rx="4" />
            <rect class="dg-box r" x="20" y="162" width="40" height="26" rx="4" />
            <rect class="dg-box r" x="68" y="162" width="40" height="26" rx="4" />
            <rect class="dg-box r" x="116" y="162" width="40" height="26" rx="4" />
            <rect class="dg-box g" x="164" y="162" width="40" height="26" rx="4" />
            <rect class="dg-box g" x="16" y="198" width="112" height="22" rx="5" />
            <text class="dg-s" x="72" y="213" text-anchor="middle">N correct: maximise</text>
            <rect class="dg-box r" x="16" y="226" width="124" height="22" rx="5" />
            <text class="dg-s" x="78" y="241" text-anchor="middle">N²−N wrong: minimise</text>

            <rect class="dg-band b" x="240" y="34" width="228" height="94" rx="10" />
            <text class="dg-h" x="254" y="54">READ ACROSS A ROW</text>
            <text class="dg-s" x="254" y="72">One image, N candidate texts —</text>
            <text class="dg-s" x="254" y="86">pick the right one.</text>
            <text class="dg-s" x="254" y="106">That is exactly the setup of</text>
            <text class="dg-s" x="254" y="120">image-to-text retrieval.</text>
            <rect class="dg-band p" x="240" y="140" width="228" height="94" rx="10" />
            <text class="dg-h" x="254" y="160">READ DOWN A COLUMN</text>
            <text class="dg-s" x="254" y="178">One text, N candidate images —</text>
            <text class="dg-s" x="254" y="192">pick the right one.</text>
            <text class="dg-s" x="254" y="212">That is exactly the setup of</text>
            <text class="dg-s" x="254" y="226">text-to-image retrieval.</text>
            <path class="dg-line green" d="M208 67 H236" marker-end="url(#ah-ct)" />
            <path class="dg-line rose" d="M208 175 H236" marker-end="url(#ah-ct2)" />

            <rect class="dg-box l" x="496" y="60" width="208" height="152" rx="10" />
            <text class="dg-h" x="510" y="80">WHY THIS IS CLEVER</text>
            <text class="dg-s" x="510" y="100">The model never has to write</text>
            <text class="dg-s" x="510" y="114">the caption — only to rank it</text>
            <text class="dg-s" x="510" y="128">above 32,767 distractors.</text>
            <text class="dg-s" x="510" y="150">Training a retrieval task</text>
            <text class="dg-s" x="510" y="164">produces a model that is</text>
            <text class="dg-s" x="510" y="178">already a retrieval engine —</text>
            <text class="dg-s" x="510" y="192">and, for free, a strong</text>
            <text class="dg-s" x="510" y="206">zero-shot classifier.</text>
          </svg>
          <figcaption>Figure 10 — The contrastive batch. Each batch is simultaneously two classification tasks — one per row, one per column — which is why CLIP emerges knowing how to retrieve in both directions.</figcaption>
        </figure>
        <p>Mechanically: for each batch of <code>N</code> (image, text) pairs, the model produces N image embeddings <code>V_1…V_n</code> and N text embeddings <code>L_1…L_n</code>, then computes cosine similarity for all <code>N²</code> possible pairings. Training maximises the N correct pairings and minimises the other <code>N² − N</code>. CLIP used <code>N = 32,768</code>.</p>
        <p>The two symmetric losses, written in plain notation since each is just a softmax cross-entropy over one row or one column (β is a trainable inverse temperature):</p>
        <pre><code>text→image:  L = -(1/N) · Σ_i log[ exp(L_iᵀ V_i · β) / Σ_j exp(L_iᵀ V_j · β) ]
image→text:  L = -(1/N) · Σ_i log[ exp(V_iᵀ L_i · β) / Σ_j exp(V_iᵀ L_j · β) ]

total = text→image loss + image→text loss     (both minimised together)</code></pre>
        <p>The payoff, in the authors' measurements: the contrastive objective delivered roughly a <strong>12× efficiency improvement</strong> over the language model objective baseline, while producing higher-quality image embeddings.</p>

        <h3 class="lesson-subhead" id="clip-apps">CLIP applications</h3>
        <p>Because zero-shot classification is where CLIP surprised people, it is worth seeing the trick explicitly: you turn class names into text prompts, embed them, and pick whichever is closest to the image embedding. No training, no fixed class list.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 216" role="img" aria-label="Zero-shot classification with CLIP: class names become prompts, are embedded, and the closest to the image embedding wins">
            <defs>
              <marker id="ah-zs" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">ZERO-SHOT CLASSIFICATION — NO TRAINING, ANY CLASS LIST YOU LIKE</text>
            <rect class="dg-box b" x="16" y="34" width="146" height="52" rx="8" />
            <text class="dg-s" x="89" y="53" text-anchor="middle">your class names</text>
            <text class="dg-s" x="89" y="67" text-anchor="middle">“cat”, “dog”, “x-ray”,</text>
            <text class="dg-s" x="89" y="80" text-anchor="middle">“a broken bicycle”…</text>
            <rect class="dg-box b" x="188" y="34" width="146" height="52" rx="8" />
            <text class="dg-s" x="261" y="53" text-anchor="middle">wrap in a prompt</text>
            <text class="dg-s" x="261" y="67" text-anchor="middle">“a photo of a {class}”</text>
            <text class="dg-s" x="261" y="80" text-anchor="middle">prompt wording matters</text>
            <rect class="dg-box i" x="360" y="34" width="140" height="52" rx="8" />
            <text class="dg-s" x="430" y="60" text-anchor="middle">N text embeddings</text>
            <text class="dg-s" x="430" y="74" text-anchor="middle">computed once, cached</text>
            <path class="dg-line cyan" d="M162 60 H184" marker-end="url(#ah-zs)" />
            <path class="dg-line cyan" d="M334 60 H356" marker-end="url(#ah-zs)" />
            <rect class="dg-box k" x="16" y="108" width="146" height="44" rx="8" />
            <text class="dg-s" x="89" y="135" text-anchor="middle">the image to classify</text>
            <rect class="dg-box i" x="360" y="108" width="140" height="44" rx="8" />
            <text class="dg-s" x="430" y="135" text-anchor="middle">1 image embedding</text>
            <path class="dg-line cyan" d="M162 130 H356" marker-end="url(#ah-zs)" />
            <rect class="dg-box g" x="540" y="66" width="164" height="62" rx="9" />
            <text class="dg-t" x="622" y="90" text-anchor="middle">argmax cosine similarity</text>
            <text class="dg-s" x="622" y="108" text-anchor="middle">→ the predicted class</text>
            <text class="dg-s" x="622" y="121" text-anchor="middle">→ and a usable confidence</text>
            <path class="dg-line cyan" d="M500 60 H520 V90 H536" marker-end="url(#ah-zs)" />
            <path class="dg-line cyan" d="M500 130 H520 V104 H536" marker-end="url(#ah-zs)" />
            <text class="dg-s" x="16" y="176">Change the class list at runtime and you have a different classifier — which is why CLIP remains a strong out-of-the-box</text>
            <text class="dg-s" x="16" y="192">baseline for image classification today, used as-is or fine-tuned.</text>
          </svg>
          <figcaption>Figure 11 — Zero-shot classification. The class list is an input rather than an architectural decision, which is the practical meaning of "zero-shot".</figcaption>
        </figure>
        <p>Beyond classification, four application families:</p>
        <ul class="lesson-layers">
          <li><strong>Text-based image retrieval.</strong> CLIP's training was conceptually image-to-text and text-to-image retrieval, so the paper noted significant promise for retrieval and search — while also being candid that on image retrieval specifically, CLIP's performance relative to the state of the art was noticeably lower. The practical recipe, as implemented by the <code>clip-retrieval</code> package: embed all your images into a vector database, embed each text query, and return the nearest images.</li>
          <li><strong>Image generation.</strong> DALL-E (2021) generated many candidate visuals per prompt and used CLIP to rerank them before showing the best. In 2022, unCLIP went further: freeze a trained CLIP, embed the text prompt with it, and let a diffusion decoder generate images conditioned on that embedding.</li>
          <li><strong>Text generation.</strong> The authors did try — a version called LM RN50 could generate text, but ran consistently around 10% below CLIP's best model across the vision-language understanding tasks they evaluated. CLIP is not used directly for text generation today.</li>
          <li><strong>Encoder backbone for LMMs.</strong> The lasting one. CLIP's image encoder became the standard vision front-end for models that <em>do</em> generate text, Flamingo and LLaVA included.</li>
        </ul>
      `,
    },
    {
      id: 'part2-flamingo',
      title: 'Part 2 · Flamingo: the dawns of LMMs',
      children: [
        { id: 'fl-arch', title: "Flamingo's high-level architecture" },
        { id: 'fl-data', title: 'Data' },
        { id: 'fl-vision', title: "Flamingo's vision encoder" },
        { id: 'fl-lm', title: "Flamingo's language model" },
        { id: 'fl-perceiver', title: 'Perceiver Resampler' },
        { id: 'fl-xattn', title: 'GATED XATTN-DENSE layers' },
        { id: 'fl-loss', title: 'Loss function' },
        { id: 'fl-training', title: 'Training' },
      ],
      html: `
        <p>Unlike CLIP, Flamingo can generate text. In a deliberately reductive view, <strong>Flamingo is CLIP plus a language model</strong>, with extra machinery that lets the language model produce text tokens conditioned on both visual and text input.</p>
        <p>That last clause is the whole engineering problem. A language model predicts the next token from preceding tokens. To make it multimodal you must get visual information into that prediction — without destroying the language ability you paid for.</p>

        <h3 class="lesson-subhead" id="fl-arch">Flamingo's high-level architecture</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 302" role="img" aria-label="Flamingo architecture: frozen vision encoder feeding a Perceiver Resampler producing 64 visual tokens, consumed by gated cross-attention layers interleaved with frozen Chinchilla language model layers">
            <defs>
              <marker id="ah-fl" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-fl2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah orange" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box c" x="16" y="34" width="128" height="52" rx="8" />
            <text class="dg-s" x="80" y="54" text-anchor="middle">images / videos</text>
            <text class="dg-s" x="80" y="68" text-anchor="middle">interleaved with text,</text>
            <text class="dg-s" x="80" y="81" text-anchor="middle">variable in number</text>
            <rect class="dg-box k frozen" x="16" y="102" width="128" height="52" rx="8" />
            <text class="dg-s" x="80" y="122" text-anchor="middle">🧊 vision encoder</text>
            <text class="dg-s" x="80" y="136" text-anchor="middle">NFNet-F6, CLIP-style</text>
            <text class="dg-s" x="80" y="149" text-anchor="middle">FROZEN</text>
            <path class="dg-line violet" d="M80 86 V98" marker-end="url(#ah-fl)" />
            <rect class="dg-box o" x="16" y="170" width="128" height="52" rx="8" />
            <text class="dg-s" x="80" y="190" text-anchor="middle">🔥 Perceiver</text>
            <text class="dg-s" x="80" y="204" text-anchor="middle">Resampler</text>
            <text class="dg-s" x="80" y="217" text-anchor="middle">TRAINED</text>
            <path class="dg-line violet" d="M80 154 V166" marker-end="url(#ah-fl)" />
            <rect class="dg-box i" x="16" y="238" width="128" height="42" rx="8" />
            <text class="dg-t" x="80" y="258" text-anchor="middle">exactly 64</text>
            <text class="dg-t" x="80" y="273" text-anchor="middle">visual tokens</text>
            <path class="dg-line violet" d="M80 222 V234" marker-end="url(#ah-fl)" />

            <text class="dg-h" x="300" y="26">THE LANGUAGE MODEL STACK — ALTERNATING FROZEN AND TRAINED</text>
            <rect class="dg-box b frozen" x="300" y="36" width="230" height="30" rx="7" />
            <text class="dg-s" x="415" y="55" text-anchor="middle">🧊 frozen Chinchilla LM layer</text>
            <rect class="dg-box o" x="300" y="74" width="230" height="30" rx="7" />
            <text class="dg-s" x="415" y="93" text-anchor="middle">🔥 GATED XATTN-DENSE</text>
            <rect class="dg-box b frozen" x="300" y="112" width="230" height="30" rx="7" />
            <text class="dg-s" x="415" y="131" text-anchor="middle">🧊 frozen Chinchilla LM layer</text>
            <rect class="dg-box o" x="300" y="150" width="230" height="30" rx="7" />
            <text class="dg-s" x="415" y="169" text-anchor="middle">🔥 GATED XATTN-DENSE</text>
            <rect class="dg-box b frozen" x="300" y="188" width="230" height="30" rx="7" />
            <text class="dg-s" x="415" y="207" text-anchor="middle">🧊 frozen Chinchilla LM layer</text>
            <text class="dg-s" x="415" y="234" text-anchor="middle">… 9 frozen Chinchilla layers in total …</text>
            <path class="dg-line orange" d="M144 259 H180 V89 H296" marker-end="url(#ah-fl2)" />
            <path class="dg-line orange dash" d="M180 165 H296" marker-end="url(#ah-fl2)" />
            <text class="dg-s" x="190" y="82">visual tokens enter</text>
            <text class="dg-s" x="190" y="150">only here, via</text>
            <text class="dg-s" x="190" y="200">cross-attention</text>

            <rect class="dg-box g" x="562" y="112" width="142" height="52" rx="8" />
            <text class="dg-t" x="633" y="134" text-anchor="middle">generated text</text>
            <text class="dg-s" x="633" y="152" text-anchor="middle">open-ended responses</text>
            <path class="dg-line violet" d="M530 138 H558" marker-end="url(#ah-fl)" />
            <rect class="dg-band l" x="562" y="180" width="142" height="112" rx="9" />
            <text class="dg-h" x="574" y="200">🧊 = frozen</text>
            <text class="dg-h" x="574" y="218">🔥 = trained</text>
            <text class="dg-s" x="574" y="240">You get vision without</text>
            <text class="dg-s" x="574" y="254">retraining a language</text>
            <text class="dg-s" x="574" y="268">model. That is the</text>
            <text class="dg-s" x="574" y="282">whole idea.</text>
          </svg>
          <figcaption>Figure 12 — Flamingo end to end. Trace the frozen/trained boundary with your finger: this diagram is the answer to the most common LMM interview question.</figcaption>
        </figure>
        <p>At the top level there are two parts:</p>
        <ol class="lesson-layers">
          <li><strong>Vision encoder.</strong> A CLIP-like model is trained with contrastive learning, then its text encoder is discarded and the vision encoder is frozen for use in the main model.</li>
          <li><strong>Language model.</strong> Flamingo finetunes Chinchilla to generate text tokens conditioned on visuals and text, using language model loss, with two additional components: the Perceiver Resampler and GATED XATTN-DENSE layers.</li>
        </ol>

        <h3 class="lesson-subhead" id="fl-data">Data</h3>
        <p>Four datasets — two (image, text) pair sets, one (video, text) set, and one interleaved image-and-text set. The interleaved set is the interesting one: it is what teaches the model to handle a document where pictures and words alternate, which is how real web pages and real conversations look.</p>
        <table>
          <thead><tr><th>Dataset</th><th>Type</th><th>Size</th><th>How it was built</th><th>Training weight</th></tr></thead>
          <tbody>
            <tr><td><strong>M3W</strong></td><td>Interleaved image and text</td><td>43M webpages</td><td>Per webpage, sample a random subsequence of 256 tokens and take up to the first 5 images appearing in it</td><td><strong>1.0</strong></td></tr>
            <tr><td><strong>ALIGN</strong></td><td>(Image, text) pairs</td><td>1.8B pairs</td><td>Texts are alt-texts, averaging ~12 tokens each</td><td>0.2</td></tr>
            <tr><td><strong>LTIP</strong></td><td>(Image, text) pairs</td><td>312M pairs</td><td>Texts are long descriptions, averaging ~20.5 tokens each</td><td>0.2</td></tr>
            <tr><td><strong>VTP</strong></td><td>(Video, text) pairs</td><td>27M short videos</td><td>~22 seconds per video on average</td><td>0.03</td></tr>
          </tbody>
        </table>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 208" role="img" aria-label="How the interleaved M3W dataset is sampled from a webpage and why interleaving enables few-shot prompting with images">
            <defs>
              <marker id="ah-m3w" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">WHY INTERLEAVED DATA IS THE UNLOCK</text>
            <rect class="dg-box" x="16" y="32" width="150" height="98" rx="8" />
            <text class="dg-s" x="91" y="52" text-anchor="middle">one webpage</text>
            <rect class="dg-box b" x="26" y="60" width="130" height="12" rx="3" />
            <rect class="dg-box k" x="26" y="76" width="52" height="20" rx="3" />
            <rect class="dg-box b" x="84" y="80" width="72" height="12" rx="3" />
            <rect class="dg-box b" x="26" y="100" width="130" height="12" rx="3" />
            <rect class="dg-box k" x="26" y="116" width="52" height="10" rx="3" />
            <rect class="dg-box c" x="204" y="46" width="156" height="70" rx="8" />
            <text class="dg-s" x="282" y="70" text-anchor="middle">sample 256 tokens</text>
            <text class="dg-s" x="282" y="84" text-anchor="middle">at a random offset,</text>
            <text class="dg-s" x="282" y="98" text-anchor="middle">keep first ≤5 images</text>
            <path class="dg-line blue" d="M166 81 H200" marker-end="url(#ah-m3w)" />
            <rect class="dg-box p" x="400" y="46" width="140" height="70" rx="8" />
            <text class="dg-s" x="470" y="70" text-anchor="middle">text · IMG · text ·</text>
            <text class="dg-s" x="470" y="84" text-anchor="middle">IMG · text …</text>
            <text class="dg-s" x="470" y="98" text-anchor="middle">one sequence</text>
            <path class="dg-line blue" d="M360 81 H396" marker-end="url(#ah-m3w)" />
            <rect class="dg-box g" x="576" y="34" width="128" height="94" rx="8" />
            <text class="dg-s" x="640" y="56" text-anchor="middle">the model learns to</text>
            <text class="dg-s" x="640" y="70" text-anchor="middle">read pictures and</text>
            <text class="dg-s" x="640" y="84" text-anchor="middle">words as one stream</text>
            <text class="dg-s" x="640" y="104" text-anchor="middle">→ few-shot prompting</text>
            <text class="dg-s" x="640" y="118" text-anchor="middle">with image examples</text>
            <path class="dg-line blue" d="M540 81 H572" marker-end="url(#ah-m3w)" />
            <rect class="dg-band y" x="12" y="148" width="696" height="52" rx="10" />
            <text class="dg-s" x="26" y="168">Note the weights: M3W is weighted 1.0 while the far larger pair datasets sit at 0.2. Volume did not decide importance —</text>
            <text class="dg-s" x="26" y="186">the interleaved format did. Pair datasets teach grounding; interleaved data teaches in-context multimodal reasoning.</text>
          </svg>
          <figcaption>Figure 13 — The M3W sampling scheme and why it matters more than its size suggests.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="fl-vision">Flamingo's vision encoder</h3>
        <p>Flamingo first trains a CLIP-like model from scratch with contrastive learning, using only the two (image, text) pair datasets — ALIGN and LTIP, 2.1B pairs together, roughly <strong>5× larger than CLIP's dataset</strong>. The differences from CLIP are worth noting because they show which choices are load-bearing and which are not:</p>
        <ul>
          <li>Text encoder: <strong>BERT</strong> instead of GPT-2.</li>
          <li>Vision encoder: a <strong>NormalizerFree ResNet (NFNet) F6</strong>.</li>
          <li>Text and vision embeddings are <strong>meanpooled</strong> before being projected into the joint space.</li>
        </ul>
        <p>Then the text encoder is thrown away. It existed only to teach the vision encoder what things look like when described in language.</p>

        <h3 class="lesson-subhead" id="fl-lm">Flamingo's language model</h3>
        <p>Flamingo uses <strong>Chinchilla</strong>, specifically freezing 9 pretrained Chinchilla LM layers. Where a traditional language model predicts the next token from preceding text tokens, Flamingo predicts the next token from preceding text <em>and</em> visual tokens.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 190" role="img" aria-label="Next token prediction conditioned on both preceding text tokens and visual tokens">
            <defs>
              <marker id="ah-nt" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">TEXT-ONLY LM</text>
            <rect class="dg-box b" x="16" y="32" width="46" height="26" rx="5" />
            <text class="dg-s" x="39" y="49" text-anchor="middle">y₁</text>
            <rect class="dg-box b" x="70" y="32" width="46" height="26" rx="5" />
            <text class="dg-s" x="93" y="49" text-anchor="middle">y₂</text>
            <rect class="dg-box b" x="124" y="32" width="46" height="26" rx="5" />
            <text class="dg-s" x="147" y="49" text-anchor="middle">y₃</text>
            <rect class="dg-box p" x="200" y="32" width="60" height="26" rx="5" />
            <text class="dg-s" x="230" y="49" text-anchor="middle">y₄ = ?</text>
            <path class="dg-line violet" d="M170 45 H196" marker-end="url(#ah-nt)" />
            <text class="dg-s" x="286" y="49">p(y₄ | y₁ y₂ y₃)</text>

            <text class="dg-h" x="16" y="92">FLAMINGO</text>
            <rect class="dg-box k" x="16" y="102" width="46" height="26" rx="5" />
            <text class="dg-s" x="39" y="119" text-anchor="middle">IMG</text>
            <rect class="dg-box b" x="70" y="102" width="46" height="26" rx="5" />
            <text class="dg-s" x="93" y="119" text-anchor="middle">y₁</text>
            <rect class="dg-box k" x="124" y="102" width="46" height="26" rx="5" />
            <text class="dg-s" x="147" y="119" text-anchor="middle">IMG</text>
            <rect class="dg-box b" x="178" y="102" width="46" height="26" rx="5" />
            <text class="dg-s" x="201" y="119" text-anchor="middle">y₂</text>
            <rect class="dg-box p" x="254" y="102" width="60" height="26" rx="5" />
            <text class="dg-s" x="284" y="119" text-anchor="middle">y₃ = ?</text>
            <path class="dg-line violet" d="M224 115 H250" marker-end="url(#ah-nt)" />
            <text class="dg-s" x="340" y="112">p(y₃ | preceding text tokens</text>
            <text class="dg-s" x="340" y="126">AND all visual tokens seen so far)</text>
            <rect class="dg-band c" x="12" y="146" width="696" height="38" rx="10" />
            <text class="dg-s" x="26" y="170">Each image is attended to only by the text that follows it — which is what makes interleaved few-shot prompting work.</text>
          </svg>
          <figcaption>Figure 14 — Conditioning on two streams. Illustration concept follows Chunyuan Li's CVPR 2023 tutorial on Large Multimodal Models.</figcaption>
        </figure>
        <p>Two components make this possible.</p>

        <h4 class="lesson-subhead4" id="fl-perceiver">Perceiver Resampler</h4>
        <p>Because visual inputs can be images or videos, the vision encoder emits a <em>variable</em> number of features — a 22-second video produces far more than a single photo. The Perceiver Resampler compresses whatever arrives into a consistent <strong>64 visual outputs</strong>. Fixed-width output is what lets the rest of the stack stop caring whether it is looking at one picture or a video.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 208" role="img" aria-label="Perceiver Resampler converting variable numbers of visual features from images and videos into a fixed 64 visual tokens">
            <defs>
              <marker id="ah-pr" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah orange" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">VARIABLE IN, FIXED OUT</text>
            <rect class="dg-box k" x="16" y="32" width="150" height="34" rx="7" />
            <text class="dg-s" x="91" y="53" text-anchor="middle">1 image → n features</text>
            <rect class="dg-box k" x="16" y="74" width="150" height="34" rx="7" />
            <text class="dg-s" x="91" y="95" text-anchor="middle">4 images → 4n features</text>
            <rect class="dg-box c" x="16" y="116" width="150" height="34" rx="7" />
            <text class="dg-s" x="91" y="137" text-anchor="middle">22s video → many more</text>
            <rect class="dg-box o" x="242" y="56" width="164" height="70" rx="9" />
            <text class="dg-t" x="324" y="80" text-anchor="middle">Perceiver Resampler</text>
            <text class="dg-s" x="324" y="98" text-anchor="middle">learned latent queries</text>
            <text class="dg-s" x="324" y="112" text-anchor="middle">cross-attend to the features</text>
            <path class="dg-line orange" d="M166 49 H210 V80 H238" marker-end="url(#ah-pr)" />
            <path class="dg-line orange" d="M166 91 H210 V91 H238" marker-end="url(#ah-pr)" />
            <path class="dg-line orange" d="M166 133 H210 V102 H238" marker-end="url(#ah-pr)" />
            <rect class="dg-box i" x="464" y="66" width="150" height="50" rx="9" />
            <text class="dg-t" x="539" y="88" text-anchor="middle">64 visual tokens</text>
            <text class="dg-s" x="539" y="106" text-anchor="middle">always exactly 64</text>
            <path class="dg-line orange thick" d="M406 91 H460" marker-end="url(#ah-pr)" />
            <rect class="dg-band y" x="12" y="158" width="696" height="44" rx="10" />
            <text class="dg-s" x="26" y="178">Curious detail: the vision encoder was trained at 288×288, but at this stage inputs are resized to 320×320. Higher test-time</text>
            <text class="dg-s" x="26" y="194">resolution than training resolution has been shown to improve performance with CNNs — a free win the authors took.</text>
          </svg>
          <figcaption>Figure 15 — The Perceiver Resampler. Its real job is decoupling the language model from the shape of the visual input.</figcaption>
        </figure>

        <h4 class="lesson-subhead4" id="fl-xattn">GATED XATTN-DENSE layers</h4>
        <p>These are inserted <em>between</em> the existing frozen LM layers, letting the language model attend efficiently to visual tokens while generating text. They are not decoration: removing them cost the authors <strong>4.2% on the overall score</strong>.</p>
        <p>The word "gated" is the important part. A learned gate, initialised so the layer starts as a no-op, lets the model open the visual channel gradually during training rather than shoving unfamiliar activations into a frozen language model and wrecking it on step one.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 222" role="img" aria-label="A gated cross-attention dense layer inserted between frozen language model layers, with a learned gate initialised at zero">
            <defs>
              <marker id="ah-gx" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b frozen" x="230" y="24" width="230" height="30" rx="7" />
            <text class="dg-s" x="345" y="43" text-anchor="middle">🧊 frozen LM layer output</text>
            <rect class="dg-box o" x="230" y="70" width="230" height="34" rx="7" />
            <text class="dg-s" x="345" y="92" text-anchor="middle">cross-attention: text queries → visual keys</text>
            <rect class="dg-box o" x="230" y="112" width="230" height="30" rx="7" />
            <text class="dg-s" x="345" y="131" text-anchor="middle">× tanh(α) gate, α initialised to 0</text>
            <rect class="dg-box o" x="230" y="150" width="230" height="30" rx="7" />
            <text class="dg-s" x="345" y="169" text-anchor="middle">dense feed-forward × tanh(β) gate</text>
            <rect class="dg-box b frozen" x="230" y="188" width="230" height="30" rx="7" />
            <text class="dg-s" x="345" y="207" text-anchor="middle">🧊 next frozen LM layer</text>
            <path class="dg-line rose" d="M345 54 V66" marker-end="url(#ah-gx)" />
            <path class="dg-line rose" d="M345 104 V108" marker-end="url(#ah-gx)" />
            <path class="dg-line rose" d="M345 142 V146" marker-end="url(#ah-gx)" />
            <path class="dg-line rose" d="M345 180 V184" marker-end="url(#ah-gx)" />
            <rect class="dg-box i" x="16" y="70" width="180" height="72" rx="8" />
            <text class="dg-s" x="106" y="98" text-anchor="middle">64 visual tokens</text>
            <text class="dg-s" x="106" y="116" text-anchor="middle">from the Perceiver</text>
            <text class="dg-s" x="106" y="130" text-anchor="middle">Resampler</text>
            <path class="dg-line rose" d="M196 100 H226" marker-end="url(#ah-gx)" />
            <rect class="dg-band g" x="496" y="52" width="212" height="126" rx="10" />
            <text class="dg-h" x="510" y="72">WHY THE GATE</text>
            <text class="dg-s" x="510" y="94">At α = 0 the layer is an exact</text>
            <text class="dg-s" x="510" y="108">identity — the frozen LM behaves</text>
            <text class="dg-s" x="510" y="122">as it always did.</text>
            <text class="dg-s" x="510" y="142">Training opens the visual channel</text>
            <text class="dg-s" x="510" y="156">gradually instead of destabilising</text>
            <text class="dg-s" x="510" y="170">a working model on step one.</text>
          </svg>
          <figcaption>Figure 16 — Gated cross-attention. Zero-initialised gating is the trick that reappears in almost every adapter method in Part 3.</figcaption>
        </figure>

        <h4 class="lesson-subhead4" id="fl-loss">Loss function</h4>
        <p>Flamingo computes the likelihood of text <code>y</code> conditioned on interleaved images and videos <code>x</code> — ordinary autoregressive factorisation, except each token may attend to the visuals that preceded it:</p>
        <pre><code>p(y | x) = Π  p(y_l | y_&lt;l , x_≤l)
          l=1..N</code></pre>
        <p>The training loss is a weighted sum of expected negative log-likelihoods across all four datasets, where λ_m is dataset m's training weight:</p>
        <pre><code>loss = Σ  λ_m · E_(x,y)~D_m [ − Σ log p(y | x) ]
      m=1..M                     l=1..L</code></pre>

        <h4 class="lesson-subhead4" id="fl-training">Training</h4>
        <p>The Chinchilla LM layers stay frozen while the added components train from scratch on all four datasets with their respective weights. Finding the right per-dataset weights turned out to be key to performance.</p>
        <div class="lesson-callout"><strong>A counterintuitive result worth remembering.</strong> VTP carries a weight of 0.03 against 0.2 and 1.0 for the others, so you would expect its contribution to be negligible. Yet removing it degraded performance on <em>all</em> video tasks. A modality can be essential to a capability while contributing almost nothing to the loss — which means ablating datasets by weight is a bad heuristic.</div>
        <p>Flamingo was never open-sourced, but there are faithful open replications: <strong>IDEFICS</strong> from HuggingFace, and <strong>mlfoundations/open_flamingo</strong>.</p>
      `,
    },
    {
      id: 'tldr',
      title: 'TL;DR: CLIP vs. Flamingo',
      children: [
        { id: 'tldr-table', title: 'Side-by-side comparison' },
        { id: 'tldr-mental', title: 'The mental model to keep' },
      ],
      html: `
        <h3 class="lesson-subhead" id="tldr-table">Side-by-side comparison</h3>
        <table>
          <thead><tr><th></th><th>CLIP (2021)</th><th>Flamingo (2022)</th></tr></thead>
          <tbody>
            <tr><td><strong>What it produces</strong></td><td>Embeddings — no text generation</td><td>Open-ended text responses</td></tr>
            <tr><td><strong>Core contribution</strong></td><td>A shared text-image embedding space</td><td>Conditioning a frozen LM on visuals</td></tr>
            <tr><td><strong>Training objective</strong></td><td>Contrastive (which text goes with which image)</td><td>Language model loss on generated text</td></tr>
            <tr><td><strong>Vision encoder</strong></td><td>ViT-L/14@336px (best) or ResNet, trained from scratch</td><td>NFNet-F6, contrastively pretrained then <strong>frozen</strong></td></tr>
            <tr><td><strong>Text side</strong></td><td>Small GPT-2-like encoder, 63M params, 8 heads</td><td>BERT for contrastive pretraining (then discarded); Chinchilla as the LM</td></tr>
            <tr><td><strong>Training data</strong></td><td>400M (image, text) pairs</td><td>2.1B pairs for the encoder; 4 datasets incl. interleaved M3W and video for the LM</td></tr>
            <tr><td><strong>Interleaved input</strong></td><td>No — one image, one text</td><td>Yes — the M3W dataset exists for this</td></tr>
            <tr><td><strong>Video</strong></td><td>No</td><td>Yes, via VTP and the Perceiver Resampler</td></tr>
            <tr><td><strong>What is frozen</strong></td><td>Nothing — all trained jointly from scratch</td><td>Vision encoder + 9 Chinchilla layers</td></tr>
            <tr><td><strong>New machinery</strong></td><td>Two projection matrices</td><td>Perceiver Resampler + GATED XATTN-DENSE</td></tr>
            <tr><td><strong>Best at</strong></td><td>Zero-shot classification, retrieval, reranking, being a backbone</td><td>Few-shot VQA, captioning, visual dialogue-ish completion</td></tr>
            <tr><td><strong>Legacy in 2026</strong></td><td>Its image encoder is still everywhere</td><td>Its frozen-plus-adapter pattern is still everywhere</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="tldr-mental">The mental model to keep</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 194" role="img" aria-label="CLIP solves alignment while Flamingo solves generation, and modern LMMs combine both">
            <defs>
              <marker id="ah-td" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band c" x="12" y="16" width="220" height="96" rx="11" />
            <text class="dg-h" x="26" y="38">CLIP SOLVES ALIGNMENT</text>
            <text class="dg-s" x="26" y="60">“put images and words in the</text>
            <text class="dg-s" x="26" y="74">same space so similarity means</text>
            <text class="dg-s" x="26" y="88">something”</text>
            <text class="dg-s" x="26" y="104">→ retrieval, classification</text>
            <rect class="dg-band o" x="252" y="16" width="220" height="96" rx="11" />
            <text class="dg-h" x="266" y="38">FLAMINGO SOLVES CONDITIONING</text>
            <text class="dg-s" x="266" y="60">“let a frozen language model</text>
            <text class="dg-s" x="266" y="74">look at pictures without</text>
            <text class="dg-s" x="266" y="88">forgetting language”</text>
            <text class="dg-s" x="266" y="104">→ VQA, captioning, dialogue</text>
            <rect class="dg-band p" x="492" y="16" width="216" height="96" rx="11" />
            <text class="dg-h" x="506" y="38">EVERY LMM SINCE</text>
            <text class="dg-s" x="506" y="60">= a CLIP-style encoder</text>
            <text class="dg-s" x="506" y="74">+ a bridge module</text>
            <text class="dg-s" x="506" y="88">+ a pretrained LLM</text>
            <text class="dg-s" x="506" y="104">Part 3 is all about the bridge.</text>
            <path class="dg-line violet" d="M232 64 H248" marker-end="url(#ah-td)" />
            <path class="dg-line violet" d="M472 64 H488" marker-end="url(#ah-td)" />
            <rect class="dg-band g" x="12" y="130" width="696" height="56" rx="10" />
            <text class="dg-h" x="26" y="150">SELF-CHECK BEFORE MOVING ON</text>
            <text class="dg-s" x="26" y="170">Can you say (a) why contrastive beat the LM objective, (b) what the Perceiver Resampler makes constant and why that</text>
            <text class="dg-s" x="26" y="182">helps, (c) what breaks if you remove the gate from GATED XATTN-DENSE? If not, reread those three subsections.</text>
          </svg>
          <figcaption>Figure 17 — The two problems and how they compose. Almost every model in Part 3 is a different answer to "what should the bridge be?"</figcaption>
        </figure>
      `,
    },
    {
      id: 'part3',
      title: 'Part 3 · Research Directions for LMMs',
      children: [
        { id: 'p3-modalities', title: 'Incorporating more data modalities' },
        { id: 'p3-instruction', title: 'Multimodal systems for instruction-following' },
        { id: 'p3-adapters', title: 'Adapters for more efficient multimodal training' },
        { id: 'p3-outputs', title: 'Generating multimodal outputs' },
      ],
      html: `
        <p>CLIP and Flamingo are a good foundation for understanding how LMMs are built, but a great deal has happened since. Four directions were flagged as the exciting ones, and all four are still live — the first three have largely been solved into products, and the fourth remains genuinely open.</p>

        <h3 class="lesson-subhead" id="p3-modalities">Incorporating more data modalities</h3>
        <p>Most multimodal systems work with text and images. It is only a matter of time before we need video, music and 3D as first-class citizens. The ambitious version of the question: could there be <em>one</em> shared embedding space for all modalities?</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 238" role="img" aria-label="Progression from two-modality embedding spaces to one shared space binding image, text, audio, depth, thermal, point clouds and video">
            <defs>
              <marker id="ah-mod" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">FROM PAIRWISE SPACES TO ONE SPACE TO BIND THEM ALL</text>
            <rect class="dg-band" x="12" y="32" width="200" height="130" rx="11" />
            <text class="dg-h" x="26" y="52">PAIRWISE (CLIP-ERA)</text>
            <rect class="dg-box k" x="26" y="62" width="70" height="24" rx="5" />
            <text class="dg-s" x="61" y="78" text-anchor="middle">image</text>
            <rect class="dg-box b" x="120" y="62" width="70" height="24" rx="5" />
            <text class="dg-s" x="155" y="78" text-anchor="middle">text</text>
            <path class="dg-line cyan" d="M96 74 H116" marker-end="url(#ah-mod)" />
            <rect class="dg-box y" x="26" y="98" width="70" height="24" rx="5" />
            <text class="dg-s" x="61" y="114" text-anchor="middle">audio</text>
            <rect class="dg-box b" x="120" y="98" width="70" height="24" rx="5" />
            <text class="dg-s" x="155" y="114" text-anchor="middle">text</text>
            <path class="dg-line cyan" d="M96 110 H116" marker-end="url(#ah-mod)" />
            <text class="dg-s" x="26" y="142">One space per pair.</text>
            <text class="dg-s" x="26" y="156">n modalities → n² problems.</text>

            <rect class="dg-band i" x="256" y="32" width="452" height="130" rx="11" />
            <text class="dg-h" x="270" y="52">SHARED (IMAGEBIND-ERA)</text>
            <rect class="dg-box i" x="416" y="76" width="130" height="64" rx="9" />
            <text class="dg-t" x="481" y="102" text-anchor="middle">one embedding</text>
            <text class="dg-t" x="481" y="118" text-anchor="middle">space</text>
            <text class="dg-s" x="481" y="133" text-anchor="middle">image as the anchor</text>
            <rect class="dg-box k" x="270" y="62" width="74" height="22" rx="5" />
            <text class="dg-s" x="307" y="78" text-anchor="middle">image</text>
            <rect class="dg-box b" x="270" y="90" width="74" height="22" rx="5" />
            <text class="dg-s" x="307" y="106" text-anchor="middle">text</text>
            <rect class="dg-box y" x="270" y="118" width="74" height="22" rx="5" />
            <text class="dg-s" x="307" y="134" text-anchor="middle">audio</text>
            <rect class="dg-box c" x="576" y="62" width="118" height="22" rx="5" />
            <text class="dg-s" x="635" y="78" text-anchor="middle">depth · thermal</text>
            <rect class="dg-box g" x="576" y="90" width="118" height="22" rx="5" />
            <text class="dg-s" x="635" y="106" text-anchor="middle">point clouds · 3D</text>
            <rect class="dg-box r" x="576" y="118" width="118" height="22" rx="5" />
            <text class="dg-s" x="635" y="134" text-anchor="middle">video · IMU</text>
            <path class="dg-line cyan" d="M344 73 H380 V96 H412" marker-end="url(#ah-mod)" />
            <path class="dg-line cyan" d="M344 101 H380 V104 H412" marker-end="url(#ah-mod)" />
            <path class="dg-line cyan" d="M344 129 H380 V112 H412" marker-end="url(#ah-mod)" />
            <path class="dg-line cyan dash" d="M546 96 H560 V73 H572" marker-end="url(#ah-mod)" />
            <path class="dg-line cyan dash" d="M546 104 H560 V101 H572" marker-end="url(#ah-mod)" />
            <path class="dg-line cyan dash" d="M546 112 H560 V129 H572" marker-end="url(#ah-mod)" />
            <rect class="dg-band g" x="12" y="176" width="696" height="56" rx="10" />
            <text class="dg-s" x="26" y="196">The surprise of the shared-space approach: you only need paired data between each new modality and <em>one</em> anchor modality.</text>
            <text class="dg-s" x="26" y="214">Bind audio↔image and depth↔image, and audio↔depth retrieval emerges without ever seeing an (audio, depth) pair.</text>
          </svg>
          <figcaption>Figure 18 — Why a single shared space is worth chasing: it turns a quadratic data-collection problem into a linear one, and cross-modal abilities appear that were never trained for.</figcaption>
        </figure>
        <p>Representative work in this direction:</p>
        <ul>
          <li><strong>ULIP</strong> — Learning a Unified Representation of Language, Images, and Point Clouds for 3D Understanding (Xue et al., Dec 2022)</li>
          <li><strong>ImageBind</strong> — One Embedding Space To Bind Them All (Girdhar et al., May 2023)</li>
          <li><strong>NExT-GPT</strong> — Any-to-Any Multimodal Large Language Model (Wu et al., Sep 2023)</li>
          <li><strong>Pathways</strong> (Jeff Dean, 2021) — whose stated vision was to enable multimodal models encompassing vision, auditory and language understanding simultaneously</li>
        </ul>

        <h3 class="lesson-subhead" id="p3-instruction">Multimodal systems for instruction-following</h3>
        <p>Flamingo was trained for <em>completion</em>, not for dialogue or instruction-following. That distinction is the same one that separates a base LLM from a chat model: completion continues a document, whereas instruction-following does what you asked and stops. It is the difference between a model that is impressive in a paper and one that is usable in a product.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 226" role="img" aria-label="Pipeline from a completion-trained multimodal model to an instruction-following one via visual instruction tuning and preference optimisation">
            <defs>
              <marker id="ah-it" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">HOW A COMPLETION MODEL BECOMES AN ASSISTANT</text>
            <rect class="dg-box r" x="16" y="34" width="150" height="66" rx="8" />
            <text class="dg-s" x="91" y="56" text-anchor="middle">completion-trained</text>
            <text class="dg-s" x="91" y="70" text-anchor="middle">LMM (Flamingo)</text>
            <text class="dg-s" x="91" y="88" text-anchor="middle">continues the document</text>
            <rect class="dg-box y" x="206" y="34" width="160" height="66" rx="8" />
            <text class="dg-s" x="286" y="52" text-anchor="middle">visual instruction</text>
            <text class="dg-s" x="286" y="66" text-anchor="middle">tuning data</text>
            <text class="dg-s" x="286" y="84" text-anchor="middle">(image, instruction,</text>
            <text class="dg-s" x="286" y="97" text-anchor="middle">response) triples</text>
            <rect class="dg-box g" x="406" y="34" width="150" height="66" rx="8" />
            <text class="dg-s" x="481" y="56" text-anchor="middle">supervised</text>
            <text class="dg-s" x="481" y="70" text-anchor="middle">finetuning</text>
            <text class="dg-s" x="481" y="88" text-anchor="middle">often LoRA / adapters</text>
            <rect class="dg-box p" x="588" y="34" width="116" height="66" rx="8" />
            <text class="dg-t" x="646" y="60" text-anchor="middle">follows</text>
            <text class="dg-t" x="646" y="76" text-anchor="middle">instructions</text>
            <text class="dg-s" x="646" y="93" text-anchor="middle">and converses</text>
            <path class="dg-line green" d="M166 67 H202" marker-end="url(#ah-it)" />
            <path class="dg-line green" d="M366 67 H402" marker-end="url(#ah-it)" />
            <path class="dg-line green" d="M556 67 H584" marker-end="url(#ah-it)" />
            <rect class="dg-band b" x="12" y="118" width="340" height="98" rx="10" />
            <text class="dg-h" x="26" y="138">WHERE THE TUNING DATA COMES FROM</text>
            <text class="dg-s" x="26" y="158">· existing captions + boxes, rewritten by a text LLM</text>
            <text class="dg-s" x="26" y="174">  into conversations (the LLaVA recipe)</text>
            <text class="dg-s" x="26" y="192">· human-written visual Q&amp;A</text>
            <text class="dg-s" x="26" y="208">· reformatting academic VQA datasets as instructions</text>
            <rect class="dg-band o" x="368" y="118" width="340" height="98" rx="10" />
            <text class="dg-h" x="382" y="138">WHAT STILL GOES WRONG</text>
            <text class="dg-s" x="382" y="158">· hallucinating objects that are not in the image</text>
            <text class="dg-s" x="382" y="176">· agreeing with a false premise in the question</text>
            <text class="dg-s" x="382" y="194">· ignoring the image and answering from language priors</text>
            <text class="dg-s" x="382" y="210">→ preference optimisation on visual grounding helps</text>
          </svg>
          <figcaption>Figure 19 — Visual instruction tuning. The third failure mode is the sneakiest: a model that answers plausibly without looking will pass casual testing and fail in production.</figcaption>
        </figure>
        <p>LaVIN's paper included side-by-side comparisons of its outputs against other LMMs — a good reminder that in this subfield, qualitative output comparison is still a primary evaluation method, with all the subjectivity that implies.</p>

        <h3 class="lesson-subhead" id="p3-adapters">Adapters for more efficient multimodal training</h3>
        <p>Flamingo reused 9 pretrained frozen Chinchilla layers, but still had to train its vision encoder, Perceiver Resampler and gated cross-attention layers from scratch — and those from-scratch modules are compute-intensive. So a large body of work asks: how little can you train and still get a working LMM?</p>
        <p>The results are striking. <strong>BLIP-2 outperformed Flamingo-80B by 8.7% on zero-shot VQA-v2 with 54× fewer trainable parameters.</strong> That is the single most persuasive number in this part of the lesson: the bridge matters more than its size.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 296" role="img" aria-label="Comparison of bridge designs: Flamingo gated cross-attention, BLIP-2 Q-Former, LLaVA linear projection, and LLaMA-Adapter style prompt adapters">
            <defs>
              <marker id="ah-ad" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">FOUR ANSWERS TO “WHAT SHOULD THE BRIDGE BE?”</text>

            <rect class="dg-band o" x="12" y="32" width="344" height="112" rx="11" />
            <text class="dg-h" x="26" y="52">FLAMINGO · GATED CROSS-ATTENTION</text>
            <rect class="dg-box k frozen" x="26" y="62" width="88" height="26" rx="6" />
            <text class="dg-s" x="70" y="79" text-anchor="middle">🧊 encoder</text>
            <rect class="dg-box o" x="130" y="62" width="96" height="26" rx="6" />
            <text class="dg-s" x="178" y="79" text-anchor="middle">🔥 resampler</text>
            <rect class="dg-box o" x="242" y="62" width="100" height="26" rx="6" />
            <text class="dg-s" x="292" y="79" text-anchor="middle">🔥 xattn layers</text>
            <path class="dg-line violet" d="M114 75 H126" marker-end="url(#ah-ad)" />
            <path class="dg-line violet" d="M226 75 H238" marker-end="url(#ah-ad)" />
            <text class="dg-s" x="26" y="106">Inserted inside the LM. Strong, but many</text>
            <text class="dg-s" x="26" y="122">new parameters and a from-scratch encoder.</text>
            <text class="dg-s" x="26" y="138">Cost: high.</text>

            <rect class="dg-band c" x="368" y="32" width="340" height="112" rx="11" />
            <text class="dg-h" x="382" y="52">BLIP-2 · Q-FORMER</text>
            <rect class="dg-box k frozen" x="382" y="62" width="84" height="26" rx="6" />
            <text class="dg-s" x="424" y="79" text-anchor="middle">🧊 encoder</text>
            <rect class="dg-box c" x="482" y="62" width="88" height="26" rx="6" />
            <text class="dg-s" x="526" y="79" text-anchor="middle">🔥 Q-Former</text>
            <rect class="dg-box b frozen" x="586" y="62" width="108" height="26" rx="6" />
            <text class="dg-s" x="640" y="79" text-anchor="middle">🧊 frozen LLM</text>
            <path class="dg-line violet" d="M466 75 H478" marker-end="url(#ah-ad)" />
            <path class="dg-line violet" d="M570 75 H582" marker-end="url(#ah-ad)" />
            <text class="dg-s" x="382" y="106">Both ends frozen; only a small querying</text>
            <text class="dg-s" x="382" y="122">transformer in the middle is trained.</text>
            <text class="dg-s" x="382" y="138">Cost: 54× fewer trainable params than Flamingo-80B.</text>

            <rect class="dg-band g" x="12" y="156" width="344" height="112" rx="11" />
            <text class="dg-h" x="26" y="176">LLaVA · LINEAR PROJECTION</text>
            <rect class="dg-box k frozen" x="26" y="186" width="88" height="26" rx="6" />
            <text class="dg-s" x="70" y="203" text-anchor="middle">🧊 CLIP ViT</text>
            <rect class="dg-box g" x="130" y="186" width="96" height="26" rx="6" />
            <text class="dg-s" x="178" y="203" text-anchor="middle">🔥 projection</text>
            <rect class="dg-box b" x="242" y="186" width="100" height="26" rx="6" />
            <text class="dg-s" x="292" y="203" text-anchor="middle">LLM (tuned)</text>
            <path class="dg-line violet" d="M114 199 H126" marker-end="url(#ah-ad)" />
            <path class="dg-line violet" d="M226 199 H238" marker-end="url(#ah-ad)" />
            <text class="dg-s" x="26" y="230">Visual features projected straight into the</text>
            <text class="dg-s" x="26" y="246">LM's token space. Almost embarrassingly simple —</text>
            <text class="dg-s" x="26" y="262">and it works. Cost: very low.</text>

            <rect class="dg-band p" x="368" y="156" width="340" height="112" rx="11" />
            <text class="dg-h" x="382" y="176">LLaMA-ADAPTER V2 / LaVIN · PROMPT ADAPTERS</text>
            <rect class="dg-box k frozen" x="382" y="186" width="84" height="26" rx="6" />
            <text class="dg-s" x="424" y="203" text-anchor="middle">🧊 encoder</text>
            <rect class="dg-box p" x="482" y="186" width="88" height="26" rx="6" />
            <text class="dg-s" x="526" y="203" text-anchor="middle">🔥 adapters</text>
            <rect class="dg-box b frozen" x="586" y="186" width="108" height="26" rx="6" />
            <text class="dg-s" x="640" y="203" text-anchor="middle">🧊 frozen LLM</text>
            <path class="dg-line violet" d="M466 199 H478" marker-end="url(#ah-ad)" />
            <path class="dg-line violet" d="M570 199 H582" marker-end="url(#ah-ad)" />
            <text class="dg-s" x="382" y="230">Small learned prompts / gated adapters injected</text>
            <text class="dg-s" x="382" y="246">into the LM. Explicitly optimised for cheap and</text>
            <text class="dg-s" x="382" y="262">quick instruction tuning. Cost: lowest.</text>

            <text class="dg-s" x="16" y="288">Read left to right, top to bottom: the field's trajectory is monotonic — freeze more, train less, keep the performance.</text>
          </svg>
          <figcaption>Figure 20 — Bridge designs compared. Two diagram references worth seeking out here are from Chunyuan Li's excellent Large Multimodal Models tutorial at CVPR 2023.</figcaption>
        </figure>
        <p>Works in this space:</p>
        <ul>
          <li><strong>BLIP-2</strong> — Bootstrapping Language-Image Pre-training with Frozen Image Encoders and Large Language Models</li>
          <li><strong>LaVIN</strong> — Cheap and Quick: Efficient Vision-Language Instruction Tuning for Large Language Models</li>
          <li><strong>LLaMA-Adapter V2</strong> — Parameter-Efficient Visual Instruction Model</li>
        </ul>

        <h3 class="lesson-subhead" id="p3-outputs">Generating multimodal outputs</h3>
        <p>Multimodal <em>input</em> is now the norm; multimodal <em>output</em> still lags. Plenty of use cases need it — ask a model to explain RLHF and a genuinely good explanation may want graphs, equations, maybe a simple animation.</p>
        <p>The design question is: to generate multimodal output, the model must first produce some shared intermediate representation. What should that intermediate be? Two families of answers.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 274" role="img" aria-label="Two options for intermediate representation when generating multimodal outputs: text or markup that gets compiled, versus tagged multimodal tokens routed to a diffusion model or a language model">
            <defs>
              <marker id="ah-out" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-out2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah pink" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="696" height="112" rx="11" />
            <text class="dg-h" x="26" y="36">OPTION 1 · INTERMEDIATE = TEXT (OR MARKUP / CODE) THAT GETS COMPILED</text>
            <rect class="dg-box b" x="26" y="48" width="120" height="60" rx="8" />
            <text class="dg-s" x="86" y="74" text-anchor="middle">the model emits</text>
            <text class="dg-s" x="86" y="90" text-anchor="middle">only text</text>
            <rect class="dg-box c" x="188" y="48" width="150" height="60" rx="8" />
            <text class="dg-s" x="263" y="68" text-anchor="middle">HTML markup (CM3),</text>
            <text class="dg-s" x="263" y="84" text-anchor="middle">LaTeX (GPT-4V),</text>
            <text class="dg-s" x="263" y="100" text-anchor="middle">SVG, Mermaid, code</text>
            <rect class="dg-box g" x="380" y="48" width="150" height="60" rx="8" />
            <text class="dg-s" x="455" y="68" text-anchor="middle">compiled / rendered</text>
            <text class="dg-s" x="455" y="84" text-anchor="middle">into a webpage, table,</text>
            <text class="dg-s" x="455" y="100" text-anchor="middle">chart or diagram</text>
            <rect class="dg-box l" x="568" y="48" width="126" height="60" rx="8" />
            <text class="dg-s" x="631" y="72" text-anchor="middle">✓ reuses existing</text>
            <text class="dg-s" x="631" y="86" text-anchor="middle">LLMs unchanged</text>
            <text class="dg-s" x="631" y="100" text-anchor="middle">✗ no photographs</text>
            <path class="dg-line blue" d="M146 78 H184" marker-end="url(#ah-out)" />
            <path class="dg-line blue" d="M338 78 H376" marker-end="url(#ah-out)" />
            <path class="dg-line blue" d="M530 78 H564" marker-end="url(#ah-out)" />

            <rect class="dg-band k" x="12" y="140" width="696" height="128" rx="11" />
            <text class="dg-h" x="26" y="160">OPTION 2 · INTERMEDIATE = MULTIMODAL TOKENS, EACH TAGGED BY TYPE</text>
            <rect class="dg-box p" x="26" y="172" width="130" height="76" rx="8" />
            <text class="dg-s" x="91" y="198" text-anchor="middle">one token stream,</text>
            <text class="dg-s" x="91" y="214" text-anchor="middle">every token tagged</text>
            <text class="dg-s" x="91" y="230" text-anchor="middle">TEXT or IMAGE</text>
            <rect class="dg-box i" x="212" y="172" width="120" height="34" rx="7" />
            <text class="dg-s" x="272" y="193" text-anchor="middle">router by tag</text>
            <rect class="dg-box b" x="386" y="166" width="150" height="34" rx="7" />
            <text class="dg-s" x="461" y="187" text-anchor="middle">text tokens → LM</text>
            <rect class="dg-box k" x="386" y="212" width="150" height="34" rx="7" />
            <text class="dg-s" x="461" y="233" text-anchor="middle">image tokens → diffusion</text>
            <rect class="dg-box l" x="568" y="180" width="126" height="60" rx="8" />
            <text class="dg-s" x="631" y="204" text-anchor="middle">✓ true any-to-any</text>
            <text class="dg-s" x="631" y="220" text-anchor="middle">✗ needs new training</text>
            <text class="dg-s" x="631" y="234" text-anchor="middle">and new tokenisers</text>
            <path class="dg-line pink" d="M156 210 H208" marker-end="url(#ah-out2)" />
            <path class="dg-line pink" d="M332 189 H360 V183 H382" marker-end="url(#ah-out2)" />
            <path class="dg-line pink" d="M332 195 H360 V229 H382" marker-end="url(#ah-out2)" />
            <path class="dg-line pink dash" d="M536 183 H552 V206 H564" marker-end="url(#ah-out2)" />
            <path class="dg-line pink dash" d="M536 229 H552 V214 H564" marker-end="url(#ah-out2)" />
          </svg>
          <figcaption>Figure 21 — Two intermediate representations. Option 1 is what you can ship today with an off-the-shelf LLM; Option 2 is the architecture the field is converging on. The multimodal-token idea comes from Caiming Xiong, whose team at Salesforce has done extensive multimodality work.</figcaption>
        </figure>
        <p>Concrete instances of Option 1: <strong>CM3</strong> (Aghajanyan et al., 2022) outputs HTML markup that compiles into webpages containing text, formatting, links and images; GPT-4V generates LaTeX that can be reconstructed into data tables. Option 1 is quietly how most "multimodal output" works in production right now — including every diagram in this lesson, which is SVG markup a language model can write.</p>
        <p>For Option 2, each token carries a tag marking it as text or image; image tokens are fed to an image model such as a diffusion model, text tokens to a language model. A good paper on the hybrid of generating and retrieving images alongside text is <strong>Generating Images with Multimodal Language Models</strong> (Koh et al., Jun 2023).</p>
      `,
    },
    {
      id: 'part4',
      title: 'Part 4 · What Changed After 2023',
      children: [
        { id: 'p4-native', title: 'From bolted-on vision to native multimodality' },
        { id: 'p4-resolution', title: 'Resolution, tiling and the visual token bill' },
        { id: 'p4-video', title: 'Video and audio grew up' },
        { id: 'p4-embodied', title: 'Screens and robots: VLMs that act' },
        { id: 'p4-unified', title: 'Unified understanding and generation' },
        { id: 'p4-eval', title: 'Evaluating LMMs, and how they fail' },
        { id: 'p4-security', title: 'Security: the image is an untrusted input' },
        { id: 'p4-build', title: 'How to actually build with an LMM today' },
      ],
      html: `
        <p>Everything above is the foundation, and it has aged well — but a lesson that stopped in 2023 would leave you with a mental model one architectural generation out of date. This part is our own addition, covering what shifted between then and now. Where the field is still unsettled, we say so rather than pretending otherwise.</p>

        <h3 class="lesson-subhead" id="p4-native">From bolted-on vision to native multimodality</h3>
        <p>The single biggest change is architectural. CLIP-plus-adapter-plus-LLM treats vision as something attached to a language model after the fact. Frontier models moved to <strong>native multimodality</strong>: one model, trained from the beginning on interleaved text, images, audio and video, with a single token stream and no seam to cross.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Comparison of the bolted-on multimodal architecture versus a natively multimodal model with one unified token stream">
            <defs>
              <marker id="ah-nv" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-nv2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="696" height="108" rx="11" />
            <text class="dg-h" x="26" y="36">THEN (2021–2023) · VISION BOLTED ONTO A LANGUAGE MODEL</text>
            <rect class="dg-box k frozen" x="26" y="48" width="112" height="30" rx="7" />
            <text class="dg-s" x="82" y="67" text-anchor="middle">🧊 CLIP encoder</text>
            <rect class="dg-box o" x="164" y="48" width="112" height="30" rx="7" />
            <text class="dg-s" x="220" y="67" text-anchor="middle">🔥 bridge module</text>
            <rect class="dg-box b frozen" x="302" y="48" width="112" height="30" rx="7" />
            <text class="dg-s" x="358" y="67" text-anchor="middle">🧊 text-only LLM</text>
            <rect class="dg-box" x="440" y="48" width="254" height="30" rx="7" />
            <text class="dg-s" x="567" y="67" text-anchor="middle">text out only</text>
            <path class="dg-line rose" d="M138 63 H160" marker-end="url(#ah-nv)" />
            <path class="dg-line rose" d="M276 63 H298" marker-end="url(#ah-nv)" />
            <path class="dg-line rose" d="M414 63 H436" marker-end="url(#ah-nv)" />
            <text class="dg-s" x="26" y="98">Consequences: vision is second-class. The LLM never learned language *with* pictures, so grounding is shallow; audio needs</text>
            <text class="dg-s" x="26" y="114">a separate speech-to-text hop that discards tone; and generation of anything but text needs a bolted-on second model.</text>

            <rect class="dg-band g" x="12" y="136" width="696" height="126" rx="11" />
            <text class="dg-h" x="26" y="156">NOW · NATIVELY MULTIMODAL, ONE STREAM, TRAINED TOGETHER FROM THE START</text>
            <rect class="dg-box k" x="26" y="168" width="86" height="22" rx="5" />
            <text class="dg-s" x="69" y="184" text-anchor="middle">image patches</text>
            <rect class="dg-box b" x="26" y="194" width="86" height="22" rx="5" />
            <text class="dg-s" x="69" y="210" text-anchor="middle">text tokens</text>
            <rect class="dg-box y" x="26" y="220" width="86" height="22" rx="5" />
            <text class="dg-s" x="69" y="236" text-anchor="middle">audio frames</text>
            <rect class="dg-box c" x="26" y="246" width="86" height="10" rx="3" />
            <rect class="dg-box i" x="150" y="176" width="140" height="66" rx="8" />
            <text class="dg-s" x="220" y="202" text-anchor="middle">one unified</text>
            <text class="dg-s" x="220" y="218" text-anchor="middle">token sequence</text>
            <rect class="dg-box p" x="330" y="176" width="150" height="66" rx="8" />
            <text class="dg-t" x="405" y="202" text-anchor="middle">single transformer</text>
            <text class="dg-s" x="405" y="220" text-anchor="middle">(often sparse / MoE)</text>
            <rect class="dg-box g" x="520" y="168" width="174" height="26" rx="6" />
            <text class="dg-s" x="607" y="185" text-anchor="middle">text</text>
            <rect class="dg-box k" x="520" y="200" width="174" height="26" rx="6" />
            <text class="dg-s" x="607" y="217" text-anchor="middle">images</text>
            <rect class="dg-box y" x="520" y="232" width="174" height="24" rx="6" />
            <text class="dg-s" x="607" y="248" text-anchor="middle">speech, with prosody intact</text>
            <path class="dg-line green" d="M112 179 H132 V202 H146" marker-end="url(#ah-nv2)" />
            <path class="dg-line green" d="M112 205 H132 V209 H146" marker-end="url(#ah-nv2)" />
            <path class="dg-line green" d="M112 231 H132 V216 H146" marker-end="url(#ah-nv2)" />
            <path class="dg-line green" d="M290 209 H326" marker-end="url(#ah-nv2)" />
            <path class="dg-line green" d="M480 209 H516" marker-end="url(#ah-nv2)" />
          </svg>
          <figcaption>Figure 22 — The architectural shift. Note what disappears in the second row: the frozen/trained boundary, the separate speech pipeline, and the assumption that output is text.</figcaption>
        </figure>
        <p>Practical consequences you can feel as a user: voice interaction that responds to tone and can be interrupted mid-sentence, because speech never round-trips through a transcript; genuinely useful chart and document reading, because the model saw millions of interleaved documents in pretraining rather than captioned photographs; and image generation and editing inside the same conversation as reasoning.</p>
        <p>Importantly, the frozen-encoder-plus-adapter pattern did <em>not</em> die — it moved down-market, and that is where most teams operate. Training a natively multimodal frontier model requires a frontier-lab budget. Adding vision to an open-weight LLM with a projection layer and LoRA is a weekend. Both patterns are correct; they just answer different questions.</p>

        <h3 class="lesson-subhead" id="p4-resolution">Resolution, tiling and the visual token bill</h3>
        <p>CLIP's 336×336 input looks quaint the moment you try to read a screenshot or an invoice: at that resolution, small text is simply gone. The fix that became standard is <strong>dynamic resolution with tiling</strong> — split a large image into tiles, encode each, and add a downscaled overview so the model still sees global layout.</p>
        <p>This solved document understanding and created the defining cost problem of production LMM work: <strong>images are expensive in tokens</strong>, and nobody notices until the bill arrives.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 282" role="img" aria-label="Dynamic resolution tiling pipeline and the resulting visual token cost accounting">
            <defs>
              <marker id="ah-rs" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">DYNAMIC RESOLUTION · HOW A BIG IMAGE BECOMES TOKENS</text>
            <rect class="dg-box k" x="16" y="34" width="112" height="86" rx="8" />
            <text class="dg-s" x="72" y="60" text-anchor="middle">one screenshot</text>
            <text class="dg-s" x="72" y="76" text-anchor="middle">or scanned page</text>
            <text class="dg-s" x="72" y="98" text-anchor="middle">high resolution,</text>
            <text class="dg-s" x="72" y="112" text-anchor="middle">small text</text>
            <rect class="dg-box c" x="164" y="34" width="30" height="30" rx="3" />
            <rect class="dg-box c" x="198" y="34" width="30" height="30" rx="3" />
            <rect class="dg-box c" x="164" y="68" width="30" height="30" rx="3" />
            <rect class="dg-box c" x="198" y="68" width="30" height="30" rx="3" />
            <text class="dg-s" x="196" y="114" text-anchor="middle">tiles</text>
            <rect class="dg-box i" x="252" y="42" width="30" height="30" rx="3" />
            <text class="dg-s" x="267" y="90" text-anchor="middle">+ global</text>
            <text class="dg-s" x="267" y="104" text-anchor="middle">thumbnail</text>
            <path class="dg-line cyan" d="M128 68 H160" marker-end="url(#ah-rs)" />
            <rect class="dg-box g" x="312" y="46" width="132" height="60" rx="8" />
            <text class="dg-s" x="378" y="70" text-anchor="middle">encode every tile</text>
            <text class="dg-s" x="378" y="86" text-anchor="middle">independently</text>
            <path class="dg-line cyan" d="M282 76 H308" marker-end="url(#ah-rs)" />
            <rect class="dg-box p" x="480" y="46" width="132" height="60" rx="8" />
            <text class="dg-t" x="546" y="70" text-anchor="middle">hundreds to</text>
            <text class="dg-t" x="546" y="88" text-anchor="middle">thousands of tokens</text>
            <path class="dg-line cyan" d="M444 76 H476" marker-end="url(#ah-rs)" />
            <text class="dg-s" x="632" y="72">✓ small text</text>
            <text class="dg-s" x="632" y="88">readable now</text>
            <rect class="dg-band y" x="12" y="132" width="340" height="140" rx="10" />
            <text class="dg-h" x="26" y="152">THE BILL NOBODY BUDGETS FOR</text>
            <text class="dg-s" x="26" y="174">· one high-res image can cost more tokens than</text>
            <text class="dg-s" x="26" y="188">  several pages of text</text>
            <text class="dg-s" x="26" y="208">· a 10-turn conversation that keeps 5 screenshots</text>
            <text class="dg-s" x="26" y="222">  in context re-pays for them every single turn</text>
            <text class="dg-s" x="26" y="242">· video is this problem multiplied by frame count</text>
            <text class="dg-s" x="26" y="262">· latency tracks tokens, so UX degrades with cost</text>

            <rect class="dg-band l" x="368" y="132" width="340" height="140" rx="10" />
            <text class="dg-h" x="382" y="152">WHAT TO DO ABOUT IT</text>
            <text class="dg-s" x="382" y="174">· downscale first; ask what resolution the task</text>
            <text class="dg-s" x="382" y="188">  actually needs — most do not need the maximum</text>
            <text class="dg-s" x="382" y="208">· crop to the region of interest before sending</text>
            <text class="dg-s" x="382" y="228">· drop or summarise old images from history</text>
            <text class="dg-s" x="382" y="248">· route: small VLM for triage, large one on escalation</text>
            <text class="dg-s" x="382" y="266">· measure tokens per request in your telemetry</text>
          </svg>
          <figcaption>Figure 23 — Tiling and its cost. If you take one operational lesson from this part: instrument visual tokens per request from day one, exactly as the platform lesson argues for routing and caching.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="p4-video">Video and audio grew up</h3>
        <p>Recall the limitation flagged in Part 1: models treated video as a silent sequence of images, even though users say sound is essential. That has substantially changed. Long-context models can ingest many minutes of video, and natively multimodal models process the audio track as audio.</p>
        <p>The hard part of video was never ingestion but <strong>redundancy</strong> — consecutive frames are nearly identical, so naive frame sampling burns context on nothing. The techniques that work:</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 236" role="img" aria-label="Video processing strategies: uniform sampling versus keyframe selection, token merging, and hierarchical summarisation with audio kept as a parallel track">
            <defs>
              <marker id="ah-vd" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">A 30-MINUTE VIDEO, FOUR WAYS</text>
            <rect class="dg-box r" x="16" y="32" width="688" height="34" rx="7" />
            <text class="dg-s" x="30" y="53">✗ every frame · 54,000 frames × hundreds of tokens each = impossible, and 95% of it is duplicate information</text>
            <rect class="dg-box y" x="16" y="74" width="688" height="34" rx="7" />
            <text class="dg-s" x="30" y="95">~ uniform sampling · 1 frame/second · simple, predictable cost, but misses the two seconds where the event happened</text>
            <rect class="dg-box g" x="16" y="116" width="688" height="34" rx="7" />
            <text class="dg-s" x="30" y="137">✓ keyframe selection + token merging · detect shot changes, drop near-duplicate patches, spend budget where content changes</text>
            <rect class="dg-box p" x="16" y="158" width="688" height="34" rx="7" />
            <text class="dg-s" x="30" y="179">✓✓ hierarchical · caption segments, index them, retrieve relevant segments per question — RAG, but over time instead of documents</text>
            <rect class="dg-band c" x="12" y="202" width="696" height="30" rx="8" />
            <text class="dg-s" x="26" y="222">…and in all four cases, keep the audio track as a parallel stream. Speech, music and sound effects carry what pixels cannot.</text>
          </svg>
          <figcaption>Figure 24 — Video strategies in ascending order of sophistication. The bottom row is the one that scales to hours, and it is structurally the same idea as retrieval-augmented generation.</figcaption>
        </figure>
        <p>On the audio side, the "audio is a voice-based alternative to text" framing has weakened considerably. Speech-to-speech models keep prosody, handle interruption, and treat non-speech sound as signal. Music generation moved from niche curiosity to a functioning product category.</p>

        <h3 class="lesson-subhead" id="p4-embodied">Screens and robots: VLMs that act</h3>
        <p>This is the development that connects this lesson to the rest of the Agentic AI track, and it was not really visible in 2023. Once a model can look at a screenshot and reason about it, the natural next step is letting it <em>act</em> on what it sees — and the same logic applies to robots, where a vision-language model becomes a vision-language-<strong>action</strong> model.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 262" role="img" aria-label="The perception-action loop shared by GUI agents and robotic vision-language-action models, with the risks of each">
            <defs>
              <marker id="ah-ac" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah orange" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">THE LOOP THAT TURNS AN LMM INTO AN AGENT</text>
            <rect class="dg-box c" x="60" y="36" width="130" height="44" rx="8" />
            <text class="dg-s" x="125" y="56" text-anchor="middle">observe</text>
            <text class="dg-s" x="125" y="71" text-anchor="middle">screenshot / camera</text>
            <rect class="dg-box b" x="240" y="36" width="130" height="44" rx="8" />
            <text class="dg-s" x="305" y="56" text-anchor="middle">ground</text>
            <text class="dg-s" x="305" y="71" text-anchor="middle">what is where, in pixels</text>
            <rect class="dg-box p" x="420" y="36" width="130" height="44" rx="8" />
            <text class="dg-s" x="485" y="56" text-anchor="middle">decide</text>
            <text class="dg-s" x="485" y="71" text-anchor="middle">next action + target</text>
            <rect class="dg-box o" x="580" y="36" width="124" height="44" rx="8" />
            <text class="dg-s" x="642" y="56" text-anchor="middle">act</text>
            <text class="dg-s" x="642" y="71" text-anchor="middle">click, type, move</text>
            <path class="dg-line orange" d="M190 58 H236" marker-end="url(#ah-ac)" />
            <path class="dg-line orange" d="M370 58 H416" marker-end="url(#ah-ac)" />
            <path class="dg-line orange" d="M550 58 H576" marker-end="url(#ah-ac)" />
            <path class="dg-line orange thick" d="M642 80 V104 H125 V84" marker-end="url(#ah-ac)" />
            <text class="dg-s" x="384" y="100" text-anchor="middle">the world changed — observe again</text>

            <rect class="dg-band b" x="12" y="122" width="340" height="132" rx="10" />
            <text class="dg-h" x="26" y="142">GUI / COMPUTER-USE AGENTS</text>
            <text class="dg-s" x="26" y="164">Reads the screen instead of an API. Works with</text>
            <text class="dg-s" x="26" y="178">software that has no integration available.</text>
            <text class="dg-s" x="26" y="200">Needs: precise coordinate grounding, high-res</text>
            <text class="dg-s" x="26" y="214">screenshots (see the token bill above), and</text>
            <text class="dg-s" x="26" y="228">approval gates before irreversible clicks.</text>
            <text class="dg-s" x="26" y="248">Brittle: a UI redesign breaks the trajectory.</text>

            <rect class="dg-band g" x="368" y="122" width="340" height="132" rx="10" />
            <text class="dg-h" x="382" y="142">ROBOTICS · VISION-LANGUAGE-ACTION</text>
            <text class="dg-s" x="382" y="164">Same loop, but actions are joint positions and</text>
            <text class="dg-s" x="382" y="178">the environment does not undo mistakes.</text>
            <text class="dg-s" x="382" y="200">Needs: action tokens in the vocabulary, control</text>
            <text class="dg-s" x="382" y="214">frequencies far above LLM latency, and</text>
            <text class="dg-s" x="382" y="228">simulation before anything touches hardware.</text>
            <text class="dg-s" x="382" y="248">This is why robotics wants small, fast VLMs.</text>
          </svg>
          <figcaption>Figure 25 — The perception-action loop. Multimodality stopped being a feature of chatbots and became the sensory layer of agents, which is why this lesson sits in the Agentic AI track.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="p4-unified">Unified understanding and generation</h3>
        <p>The multimodal-output question from Part 3 is the one that has moved most, and it is still not settled. The direction of travel is toward models that understand and generate images in one set of weights, rather than a language model calling out to a separate diffusion model.</p>
        <p>The payoff of unification is that generation inherits reasoning: a model that understands "the chart should show quarterly revenue with Q3 highlighted" can produce an image consistent with that instruction, and can edit it conversationally, because the same weights hold both the understanding and the generation. The open question is <strong>tokenisation</strong> — what a discrete image token should be, and whether autoregressive generation over such tokens, diffusion, or a hybrid ultimately wins. Treat anyone claiming certainty here with suspicion.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 214" role="img" aria-label="Three approaches to multimodal generation: pipeline with a separate diffusion model, unified autoregressive tokens, and hybrid approaches">
            <defs>
              <marker id="ah-un" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah pink" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band" x="12" y="16" width="228" height="182" rx="11" />
            <text class="dg-h" x="26" y="36">PIPELINE (SHIPPING NOW)</text>
            <rect class="dg-box b" x="26" y="46" width="200" height="26" rx="6" />
            <text class="dg-s" x="126" y="63" text-anchor="middle">LLM writes a prompt</text>
            <rect class="dg-box k" x="26" y="82" width="200" height="26" rx="6" />
            <text class="dg-s" x="126" y="99" text-anchor="middle">diffusion model renders it</text>
            <path class="dg-line pink" d="M126 72 V78" marker-end="url(#ah-un)" />
            <text class="dg-s" x="26" y="130">✓ works today, modular</text>
            <text class="dg-s" x="26" y="150">✗ the renderer never sees</text>
            <text class="dg-s" x="26" y="164">  the reasoning, only the</text>
            <text class="dg-s" x="26" y="178">  prompt — so edits drift</text>

            <rect class="dg-band p" x="252" y="16" width="228" height="182" rx="11" />
            <text class="dg-h" x="266" y="36">UNIFIED AUTOREGRESSIVE</text>
            <rect class="dg-box p" x="266" y="46" width="200" height="26" rx="6" />
            <text class="dg-s" x="366" y="63" text-anchor="middle">one model, one vocabulary</text>
            <rect class="dg-box i" x="266" y="82" width="200" height="26" rx="6" />
            <text class="dg-s" x="366" y="99" text-anchor="middle">text tokens + image tokens</text>
            <path class="dg-line pink" d="M366 72 V78" marker-end="url(#ah-un)" />
            <text class="dg-s" x="266" y="130">✓ generation inherits</text>
            <text class="dg-s" x="266" y="144">  reasoning; edits are</text>
            <text class="dg-s" x="266" y="158">  conversational</text>
            <text class="dg-s" x="266" y="178">✗ image tokenisation is</text>
            <text class="dg-s" x="266" y="192">  an unsolved trade-off</text>

            <rect class="dg-band c" x="492" y="16" width="216" height="182" rx="11" />
            <text class="dg-h" x="506" y="36">HYBRID</text>
            <rect class="dg-box c" x="506" y="46" width="188" height="26" rx="6" />
            <text class="dg-s" x="600" y="63" text-anchor="middle">AR plans the layout</text>
            <rect class="dg-box k" x="506" y="82" width="188" height="26" rx="6" />
            <text class="dg-s" x="600" y="99" text-anchor="middle">diffusion head paints it</text>
            <path class="dg-line pink" d="M600 72 V78" marker-end="url(#ah-un)" />
            <text class="dg-s" x="506" y="130">✓ reasoning where you</text>
            <text class="dg-s" x="506" y="144">  need it, fidelity where</text>
            <text class="dg-s" x="506" y="158">  you need that</text>
            <text class="dg-s" x="506" y="178">? currently the most</text>
            <text class="dg-s" x="506" y="192">  active middle ground</text>
          </svg>
          <figcaption>Figure 26 — Three routes to multimodal output. This is the live frontier; the honest summary is that all three are being pursued and the trade-offs are not resolved.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="p4-eval">Evaluating LMMs, and how they fail</h3>
        <p>In 2023 much LMM evaluation was cherry-picked qualitative comparison — exactly what the LaVIN figure represents. That is no longer defensible, because LMMs fail in ways that look fine at a glance.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 232" role="img" aria-label="Four characteristic LMM failure modes and the evaluation practice that catches each"><defs>
              <marker id="ah-ev" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">FAILURE MODE → WHAT CATCHES IT</text>
            <rect class="dg-box r" x="16" y="32" width="296" height="42" rx="7" />
            <text class="dg-s" x="30" y="50">object hallucination — describes things</text>
            <text class="dg-s" x="30" y="66">that are not in the image</text>
            <rect class="dg-box g" x="380" y="32" width="324" height="42" rx="7" />
            <text class="dg-s" x="394" y="50">paired yes/no probes about present and absent objects;</text>
            <text class="dg-s" x="394" y="66">never score captions by vibes alone</text>
            <path class="dg-line rose" d="M312 53 H376" marker-end="url(#ah-ev)" />
            <rect class="dg-box r" x="16" y="82" width="296" height="42" rx="7" />
            <text class="dg-s" x="30" y="100">blind answering — ignores the image and</text>
            <text class="dg-s" x="30" y="116">answers from language priors</text>
            <rect class="dg-box g" x="380" y="82" width="324" height="42" rx="7" />
            <text class="dg-s" x="394" y="100">run the eval with the image removed. Any question the</text>
            <text class="dg-s" x="394" y="116">model still gets right was never testing vision.</text>
            <path class="dg-line rose" d="M312 103 H376" marker-end="url(#ah-ev)" />
            <rect class="dg-box r" x="16" y="132" width="296" height="42" rx="7" />
            <text class="dg-s" x="30" y="150">sycophancy — accepts a false premise</text>
            <text class="dg-s" x="30" y="166">planted in the question</text>
            <rect class="dg-box g" x="380" y="132" width="324" height="42" rx="7" />
            <text class="dg-s" x="394" y="150">include adversarial questions about absent objects</text>
            <text class="dg-s" x="394" y="166">(“how many cars?” on a photo with none)</text>
            <path class="dg-line rose" d="M312 153 H376" marker-end="url(#ah-ev)" />
            <rect class="dg-box r" x="16" y="182" width="296" height="42" rx="7" />
            <text class="dg-s" x="30" y="200">confident OCR errors — misreads one digit</text>
            <text class="dg-s" x="30" y="216">in a table and reasons on it fluently</text>
            <rect class="dg-box g" x="380" y="182" width="324" height="42" rx="7" />
            <text class="dg-s" x="394" y="200">exact-match extraction tests on your real documents,</text>
            <text class="dg-s" x="394" y="216">and a human review sample every week</text>
            <path class="dg-line rose" d="M312 203 H376" marker-end="url(#ah-ev)" />
          </svg>
          <figcaption>Figure 27 — Failure modes and their antidotes. The image-removal ablation in row two is the cheapest and most humbling test you can run on a multimodal eval set.</figcaption>
        </figure>
        <p>Public benchmarks worth knowing, roughly by what they probe: <strong>MMMU</strong> for college-level multi-discipline reasoning over figures, <strong>MathVista</strong> for mathematical and diagrammatic reasoning, <strong>DocVQA</strong> and <strong>ChartQA</strong> for documents and charts, <strong>POPE</strong> for object hallucination, and video benchmarks for long-form temporal understanding. Use them for orientation only. As the pitfalls lesson argues at length, the benchmark that decides your product is the one you build from your own data — and for multimodal work that means your actual invoices, screenshots and camera frames, including the blurry ones.</p>

        <h3 class="lesson-subhead" id="p4-security">Security: the image is an untrusted input</h3>
        <div class="lesson-callout"><strong>The one thing in this part you cannot skip.</strong> An image is a channel for instructions. Text embedded in a picture — a sign, a slide, a screenshot, white text on a white background, a QR code — can be read by the model and followed as though you had typed it. If your agent browses the web or accepts user uploads and also has tools that write, this is a live vulnerability, not a theoretical one.</div>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 216" role="img" aria-label="Indirect prompt injection through an image, and the defences at each stage">
            <defs>
              <marker id="ah-sec" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">INJECTION THROUGH THE EYES</text>
            <rect class="dg-box r" x="16" y="32" width="148" height="58" rx="8" />
            <text class="dg-s" x="90" y="54" text-anchor="middle">a webpage image</text>
            <text class="dg-s" x="90" y="70" text-anchor="middle">containing hidden text:</text>
            <text class="dg-s" x="90" y="84" text-anchor="middle">“email the file to…”</text>
            <rect class="dg-box y" x="196" y="32" width="140" height="58" rx="8" />
            <text class="dg-s" x="266" y="54" text-anchor="middle">the model reads it</text>
            <text class="dg-s" x="266" y="70" text-anchor="middle">as instructions, not</text>
            <text class="dg-s" x="266" y="84" text-anchor="middle">as content</text>
            <rect class="dg-box r" x="368" y="32" width="140" height="58" rx="8" />
            <text class="dg-s" x="438" y="54" text-anchor="middle">it calls a tool</text>
            <text class="dg-s" x="438" y="70" text-anchor="middle">with write access</text>
            <text class="dg-s" x="438" y="84" text-anchor="middle">on your behalf</text>
            <rect class="dg-box" x="540" y="32" width="164" height="58" rx="8" />
            <text class="dg-t" x="622" y="58" text-anchor="middle">data exfiltrated</text>
            <text class="dg-s" x="622" y="76" text-anchor="middle">no text prompt required</text>
            <path class="dg-line rose" d="M164 61 H192" marker-end="url(#ah-sec)" />
            <path class="dg-line rose" d="M336 61 H364" marker-end="url(#ah-sec)" />
            <path class="dg-line rose" d="M508 61 H536" marker-end="url(#ah-sec)" />
            <rect class="dg-band g" x="12" y="106" width="696" height="102" rx="10" />
            <text class="dg-h" x="26" y="126">DEFENCES — DEFENCE IN DEPTH, BECAUSE NO SINGLE ONE IS SUFFICIENT</text>
            <text class="dg-s" x="26" y="148">· treat everything extracted from an image as untrusted data, never as instructions</text>
            <text class="dg-s" x="26" y="166">· separate the reading step from the acting step, so the reader has no tool access at all</text>
            <text class="dg-s" x="26" y="184">· require human approval for irreversible write actions, and log the image that triggered them</text>
            <text class="dg-s" x="26" y="202">· scan uploads for PII and for embedded instruction text before they ever reach the model</text>
          </svg>
          <figcaption>Figure 28 — Indirect prompt injection via images. The middle band is the same guardrail architecture as the Generative AI Platform lesson, extended to a channel that lesson's diagrams did not include.</figcaption>
        </figure>
        <p>Two adjacent concerns worth naming: uploaded images carry PII and location metadata that your logs will happily retain forever unless you strip it, and adversarial perturbations invisible to a human can still shift model behaviour. Neither is a reason to avoid multimodal input; both are reasons to treat it as an attack surface.</p>

        <h3 class="lesson-subhead" id="p4-build">How to actually build with an LMM today</h3>
        <p>None of the above tells you what to do on Monday. This does — a decision path from cheapest to most expensive, stopping as soon as something works.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Decision ladder for building with multimodal models from API calls up to full pretraining">
            <defs>
              <marker id="ah-bd" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">STOP AT THE FIRST RUNG THAT WORKS</text>
            <rect class="dg-box g" x="16" y="32" width="688" height="38" rx="7" />
            <text class="dg-s" x="30" y="49">1 · CALL A HOSTED MULTIMODAL API. Days of work. Covers VQA, captioning, document extraction, screenshots.</text>
            <text class="dg-s" x="30" y="64">Build your eval set here, before anything else. Most projects should never leave this rung.</text>
            <rect class="dg-box l" x="16" y="78" width="688" height="38" rx="7" />
            <text class="dg-s" x="30" y="95">2 · ADD RETRIEVAL. Embed images and text into one space (a CLIP-family model) and retrieve before generating.</text>
            <text class="dg-s" x="30" y="110">This is the Part 1 joint-embedding idea, still the right answer for search over your own image corpus.</text>
            <rect class="dg-box c" x="16" y="124" width="688" height="38" rx="7" />
            <text class="dg-s" x="30" y="141">3 · SELF-HOST AN OPEN-WEIGHT VLM. Qwen-VL, InternVL, LLaVA-family, Molmo, Pixtral, IDEFICS.</text>
            <text class="dg-s" x="30" y="156">Reach for this when data cannot leave your network, volume makes per-call pricing hurt, or you need latency control.</text>
            <rect class="dg-box y" x="16" y="170" width="688" height="38" rx="7" />
            <text class="dg-s" x="30" y="187">4 · FINETUNE THE BRIDGE. LoRA or adapters on a projection layer — the Part 3 lesson applied.</text>
            <text class="dg-s" x="30" y="202">Justified for genuinely unusual visual domains: medical imaging, satellite, industrial inspection, niche document layouts.</text>
            <rect class="dg-box r" x="16" y="216" width="688" height="38" rx="7" />
            <text class="dg-s" x="30" y="233">5 · PRETRAIN A MULTIMODAL MODEL. Almost certainly not you. Frontier-lab budgets, and the field moves faster than</text>
            <text class="dg-s" x="30" y="248">your training run finishes. If you are seriously considering this rung, revisit pitfall 3 in the pitfalls lesson first.</text>
          </svg>
          <figcaption>Figure 29 — The build ladder. The distance between rung 1 and rung 5 is roughly four orders of magnitude in cost and, for most products, zero difference in outcome.</figcaption>
        </figure>
      `,
    },
    {
      id: 'conclusion',
      title: 'Conclusion & Resources',
      children: [
        { id: 'cc-conclusion', title: 'Conclusion' },
        { id: 'cc-timeline', title: 'A timeline of multimodal systems' },
        { id: 'cc-selfcheck', title: 'Self-check: fifteen questions' },
        { id: 'cc-exercises', title: 'Exercises' },
        { id: 'cc-resources', title: 'Resources' },
      ],
      html: `
        <h3 class="lesson-subhead" id="cc-conclusion">Conclusion</h3>
        <p>The core patterns are worth restating, because they survived three years of extremely fast movement and will probably survive the next three: <strong>encode each modality, align the encodings into a shared space, and — if you need generation — condition a language model on the aligned representation.</strong> CLIP solved the second step so well that its encoder is still in service. Flamingo solved the third step with a pattern (freeze the expensive parts, train a small bridge) that every efficiency result since has refined rather than replaced.</p>
        <p>Two caveats deserve to be carried forward. First, we are still early — early enough that when the source article was written, a friend of its author doubted whether the abbreviation "LMM" would even catch on. Second, and more important: <strong>LMMs do not make LLMs obsolete.</strong> An LMM extends an LLM, so its performance rests on the base language model's performance. That is why labs working on multimodal systems work on language models in parallel, and why "should we use a multimodal model?" is rarely the interesting question — "is the base model good enough at reasoning?" usually is.</p>
        <p>If you want the one-sentence version of Part 4: multimodality stopped being a feature of chat interfaces and became the sensory layer of agents. Which is why the next lessons in this track are about what a system does once it can see.</p>

        <h3 class="lesson-subhead" id="cc-timeline">A timeline of multimodal systems</h3>
        <p>An incomplete list, ordered by time, to convey how fast this space has moved:</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 292" role="img" aria-label="Timeline of multimodal systems from 2021 to the present, grouped by year and theme">
            <defs>
              <marker id="ah-tl" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <path class="dg-line violet thick" d="M96 30 V262" marker-end="url(#ah-tl)" />
            <text class="dg-h" x="16" y="50">2021</text>
            <rect class="dg-box c" x="120" y="34" width="584" height="34" rx="7" />
            <text class="dg-s" x="134" y="49">CLIP · DALL-E · ALIGN · Pathways vision announced</text>
            <text class="dg-s" x="134" y="63">theme: alignment. Learn a shared space and discover you get zero-shot classification for free.</text>
            <text class="dg-h" x="16" y="94">2022</text>
            <rect class="dg-box b" x="120" y="78" width="584" height="34" rx="7" />
            <text class="dg-s" x="134" y="93">Flamingo · BLIP · unCLIP · Stable Diffusion · CM3 · ULIP · Chinchilla as a base</text>
            <text class="dg-s" x="134" y="107">theme: generation. Frozen LMs learn to see; diffusion makes image output a commodity.</text>
            <text class="dg-h" x="16" y="138">2023</text>
            <rect class="dg-box g" x="120" y="122" width="584" height="34" rx="7" />
            <text class="dg-s" x="134" y="137">GPT-4V · BLIP-2 · LLaVA · LLaMA-Adapter V2 · LaVIN · ImageBind · NExT-GPT · IDEFICS · Koh et al.</text>
            <text class="dg-s" x="134" y="151">theme: efficiency and instruction-following. Freeze more, train less, and start following instructions.</text>
            <text class="dg-h" x="16" y="182">2024</text>
            <rect class="dg-box y" x="120" y="166" width="584" height="34" rx="7" />
            <text class="dg-s" x="134" y="181">open-weight VLM families mature: Qwen-VL, InternVL, LLaVA-NeXT, Molmo, Pixtral · dynamic resolution standard</text>
            <text class="dg-s" x="134" y="195">theme: documents and screens. Tiling makes small text readable, which makes real work possible.</text>
            <text class="dg-h" x="16" y="226">2025</text>
            <rect class="dg-box o" x="120" y="210" width="584" height="34" rx="7" />
            <text class="dg-s" x="134" y="225">natively multimodal frontier models · speech-to-speech · long-video context · computer-use and VLA agents</text>
            <text class="dg-s" x="134" y="239">theme: acting. The loop closes — models that see also click, type and move.</text>
            <text class="dg-h" x="16" y="270">now</text>
            <rect class="dg-box p" x="120" y="254" width="584" height="34" rx="7" />
            <text class="dg-s" x="134" y="269">unified understanding + generation · agentic multimodal workflows · on-device small VLMs</text>
            <text class="dg-s" x="134" y="283">theme: still unsettled. Image tokenisation and multimodal output remain genuinely open problems.</text>
          </svg>
          <figcaption>Figure 30 — Five years, five themes. Each year's theme is roughly the previous year's bottleneck.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cc-selfcheck">Self-check: fifteen questions</h3>
        <p>If you can answer these without scrolling, you have the lesson.</p>
        <ol class="lesson-checklist">
          <li>Name the three distinct things "multimodal" can mean, and give a system that is multimodal but not an LMM.</li>
          <li>Why is image the most versatile <em>input</em> modality but text the most powerful <em>output</em> modality?</li>
          <li>What is lost when speech is represented as text, and what is lost when video is represented as a sequence of frames?</li>
          <li>Draw the split between generation and vision-language understanding, with two tasks under each.</li>
          <li>Describe the two approaches to text-based image retrieval and say which scales better, and why.</li>
          <li>What are the three components of any multimodal system, and which one does CLIP contribute?</li>
          <li>How was CLIP's 400M-pair dataset built without human annotation, and why was each image paired with co-occurring text rather than the query?</li>
          <li>Explain why the classifier objective blocks zero-shot learning.</li>
          <li>Explain why the language model objective was hard to train, and how the contrastive objective avoids that difficulty. What efficiency gain resulted?</li>
          <li>In a contrastive batch of N pairs, how many similarity scores are computed, how many are maximised, and what are the two retrieval tasks hiding in the matrix?</li>
          <li>List four things CLIP's image encoder is used for besides classification.</li>
          <li>In Flamingo, what is frozen, what is trained, and what is discarded after pretraining?</li>
          <li>What does the Perceiver Resampler make constant, and why does that simplify everything downstream?</li>
          <li>Why is the gate in GATED XATTN-DENSE initialised so the layer starts as an identity function?</li>
          <li>VTP had a training weight of 0.03 but removing it hurt all video tasks. What general lesson does that teach about ablating training data?</li>
        </ol>

        <h3 class="lesson-subhead" id="cc-exercises">Exercises</h3>
        <ol class="lesson-layers">
          <li><strong>Build a joint-embedding image search over your own photos.</strong> Embed a few thousand images with an open CLIP model, store the vectors, and query them with sentences. Then find a query it fails on and work out whether the failure is in the embedding or in your expectations. This is Figure 5, approach 2, in about fifty lines.</li>
          <li><strong>Run the image-removal ablation.</strong> Take any multimodal eval set — ideally one you built from your own data — and run it with the images stripped out. Whatever the model still answers correctly was never testing vision. Report the percentage; it is usually higher than people expect.</li>
          <li><strong>Measure your visual token bill.</strong> Send the same document at full resolution, at half, and cropped to the region that matters. Record tokens, latency, cost and accuracy for each. Decide which resolution your task actually needs rather than defaulting to the maximum.</li>
          <li><strong>Reproduce the zero-shot trick by hand.</strong> Classify images into a class list you invent at runtime using only cosine similarity against prompt embeddings, then measure how much the accuracy moves when you change the prompt template. The sensitivity is the lesson.</li>
          <li><strong>Attempt an injection on your own system.</strong> Put an instruction in an image — as visible text, then as very low-contrast text — and see whether your pipeline follows it. If it does, separate the reading step from the acting step and try again.</li>
        </ol>

        <h3 class="lesson-subhead" id="cc-resources">Resources</h3>
        <p><strong>Foundational papers</strong></p>
        <ul>
          <li>Learning Transferable Visual Models From Natural Language Supervision (Radford et al., 2021) — CLIP</li>
          <li>Flamingo: a Visual Language Model for Few-Shot Learning (Alayrac et al., 2022)</li>
          <li>Hierarchical Text-Conditional Image Generation with CLIP Latents (Ramesh et al., 2022) — unCLIP</li>
          <li>BLIP-2: Bootstrapping Language-Image Pre-training with Frozen Image Encoders and Large Language Models (Li et al., 2023)</li>
          <li>Visual Instruction Tuning (Liu et al., 2023) — LLaVA</li>
          <li>LLaMA-Adapter V2: Parameter-Efficient Visual Instruction Model</li>
          <li>Cheap and Quick: Efficient Vision-Language Instruction Tuning for Large Language Models — LaVIN</li>
          <li>ImageBind: One Embedding Space To Bind Them All (Girdhar et al., 2023)</li>
          <li>ULIP: Learning a Unified Representation of Language, Images, and Point Clouds for 3D Understanding (Xue et al., 2022)</li>
          <li>NExT-GPT: Any-to-Any Multimodal Large Language Model (Wu et al., 2023)</li>
          <li>CM3: A Causal Masked Multimodal Model of the Internet (Aghajanyan et al., 2022)</li>
          <li>Generating Images with Multimodal Language Models (Koh et al., 2023)</li>
          <li>Multimodal Biomedical AI (Acosta et al., Nature Medicine 2022) — the healthcare framing behind Figure 2</li>
        </ul>
        <p><strong>Tutorials and talks</strong></p>
        <ul>
          <li>Chunyuan Li, <em>Large Multimodal Models</em> — CVPR 2023 tutorial. Genuinely excellent, and the source of several canonical diagrams in this area.</li>
          <li>OpenAI's GPT-4V system card, for capability and limitation framing.</li>
        </ul>
        <p><strong>Open implementations to read and run</strong></p>
        <ul>
          <li><code>mlfoundations/open_flamingo</code> and HuggingFace <strong>IDEFICS</strong> — open replications of Flamingo</li>
          <li><code>mlfoundations/open_clip</code> — open CLIP training and pretrained weights</li>
          <li><code>rom1504/clip-retrieval</code> — the embed-index-query retrieval pipeline described in Part 2</li>
          <li>Open-weight VLM families: Qwen-VL, InternVL, LLaVA-NeXT, Molmo, Pixtral</li>
          <li><strong>MusicGen</strong> on HuggingFace — for the non-speech audio side that most multimodal writing skips</li>
        </ul>
        <p><strong>Benchmarks</strong></p>
        <ul>
          <li>MMMU (multi-discipline reasoning over figures), MathVista (mathematical and diagrammatic), DocVQA and ChartQA (documents and charts), POPE (object hallucination), plus long-form video benchmarks. Orientation only — build your own eval set.</li>
        </ul>
        <p><strong>Related lessons in this track</strong></p>
        <ul>
          <li><a href="/learn/agentic-ai/agents">Agents</a> — what a system does once it can see: tools, planning, reflection, failure modes</li>
          <li><a href="/learn/agentic-ai/genai-platform">Building a Generative AI Platform</a> — the guardrails, routing, caching and observability that Part 4 keeps pointing at</li>
          <li><a href="/learn/agentic-ai/ai-pitfalls">Common Pitfalls When Building GenAI Applications</a> — read pitfall 3 before you consider rung 5 of the build ladder</li>
          <li><a href="/learn/agentic-ai/real-time-ml">Real-Time Machine Learning</a> — freshness ladders, which apply directly to embedding-based image retrieval</li>
        </ul>
      `,
    },
  ],
  sourceNote:
    'Original lesson written for BinodTech. The three-part structure, section order, model choices (CLIP and Flamingo) and the technical facts, figures and case studies in Parts 1\\u20133 follow Chip Huyen\\u2019s <a href="https://huyenchip.com/2023/10/10/multimodal.html" rel="noopener noreferrer" target="_blank">Multimodality and Large Multimodal Models (LMMs)</a> (October 2023) and are credited to her and to the original papers and speakers she cites, including Chunyuan Li\\u2019s CVPR 2023 tutorial and Caiming Xiong\\u2019s comments on multimodal tokens. All prose, analogies, tables, diagrams, self-check questions and exercises here are our own, as is Part 4 (\\u201cWhat Changed After 2023\\u201d), which covers native multimodality, dynamic-resolution tiling, video and audio, GUI and robotic agents, unified generation, evaluation practice and image-channel prompt injection. Quoted phrases are short and attributed.',
};
