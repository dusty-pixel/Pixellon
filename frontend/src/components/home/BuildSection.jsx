import SectionHeader from '../SectionHeader'
import MagneticButton from '../motion/MagneticButton'
import { SectionReveal, Stagger, StaggerItem } from '../motion/Reveal'
import { useDiscovery } from '../../gamification/XPProvider'

const WORDS = ['CODE', 'CREATE', 'DESIGN', 'MOD', 'BUILD', 'CONNECT']

const TERM = [
  { cmd: '> join pixellon', out: null },
  { cmd: null, out: 'ACCESS GRANTED — BUILDER MODE' },
  { cmd: '> deploy my-world --voxel', out: null },
  { cmd: null, out: 'WORLD COMPILED ✓ 60 FPS • 0 ERRORS' },
]

/** Creator workshop: retro terminal + assembling voxel words. */
export default function BuildSection() {
  const discover = useDiscovery('build-bay', 'BUILD BAY', 10)

  return (
    <section id="build" ref={discover}>
      <SectionHeader index="05" title="Build With Pixellon" subtitle="A workshop for creators. Bring blocks, leave with worlds." />
      <div className="grid gap-4 lg:grid-cols-12">
        {/* terminal */}
        <SectionReveal className="lg:col-span-6">
          <div className="h-full overflow-hidden rounded-2xl border border-surface-700 bg-[#0a0e16]">
            <div className="flex items-center gap-1.5 border-b border-surface-700 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-2 font-pixel text-xs tracking-[0.25em] text-brand-muted">pixellon://workshop</span>
            </div>
            <div className="space-y-2 p-5 font-mono text-[13px] leading-relaxed">
              {TERM.map((l, i) => (
                <div key={i}>
                  {l.cmd && <p className="text-brand-text">{l.cmd}<span className="term-caret" /></p>}
                  {l.out && <p className="text-emerald-400">▸ {l.out}</p>}
                </div>
              ))}
              <div className="pt-3">
                <MagneticButton
                  to="/indie"
                  strength={0.2}
                  className="rounded-lg border border-brand-primary/50 bg-brand-primary/10 px-4 py-2 font-mono text-xs font-bold tracking-widest text-brand-accent transition-colors hover:bg-brand-primary/20"
                >
                  [ START BUILDING ]
                </MagneticButton>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* voxel words */}
        <div className="relative overflow-hidden rounded-2xl border border-surface-700 bg-surface-900 p-6 lg:col-span-6">
          <div aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-lg border border-brand-primary/20" />
          <div aria-hidden className="absolute -bottom-8 -left-8 h-24 w-24 rounded-lg border border-brand-accent/20" />
          <p className="font-pixel text-xs tracking-[0.3em] text-brand-muted">ASSEMBLING…</p>
          <Stagger className="mt-4 flex flex-wrap gap-2.5" stagger={0.09}>
            {WORDS.map((w) => (
              <StaggerItem key={w}>
                <span className="inline-block rounded-[4px] border border-brand-primary/40 bg-brand-primary/10 px-3.5 py-2 font-display text-sm font-extrabold tracking-widest text-brand-text shadow-[0_3px_0_rgba(2,132,199,0.35)]">
                  {w}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-brand-muted">
            Mod a game, design a world, or spotlight your indie build. The arena ships creator tools with the same care as the games themselves.
          </p>
        </div>
      </div>
    </section>
  )
}
