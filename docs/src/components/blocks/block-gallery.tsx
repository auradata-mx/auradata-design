import Link from 'next/link';
import { blocks, blockPath, type BlockName } from './block-catalog';

function Line({ x, y, width }: { x: number; y: number; width: number }) {
  return <rect x={x} y={y} width={width} height="4" rx="2" fill="var(--color-fd-muted-foreground)" opacity=".45" />;
}

function Panel({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} rx="5" fill="var(--color-fd-card)" stroke="var(--color-fd-border)" />;
}

function Thumbnail({ name }: { name: BlockName }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 256 126" className="block h-auto w-full bg-fd-muted/60">
      <Panel x={20} y={12} w={216} h={102} />
      {name === 'app-shell' ? (
        <>
          <path d="M78 12v102m0-79h158" stroke="var(--color-fd-border)" />
          <Line x={29} y={23} width={35} />
          {[45, 57, 69, 100].map((y) => <Line key={y} x={29} y={y} width={32} />)}
          <Line x={88} y={23} width={54} />
          <Line x={88} y={47} width={60} />
          {[88, 136, 184].map((x) => <Panel key={x} x={x} y={60} w={42} h={26} />)}
        </>
      ) : name === 'dashboard' ? (
        <>
          <Line x={30} y={23} width={54} />
          {[30, 80, 130, 180].map((x) => <Panel key={x} x={x} y={34} w={46} h={20} />)}
          <Panel x={30} y={61} w={124} h={43} />
          <path d="m40 93 21-9 22 2 21-13 19 5 21-10" fill="none" stroke="var(--color-fd-primary)" strokeWidth="2" />
          <circle cx="190" cy="81" r="15" fill="none" stroke="var(--color-fd-primary)" strokeWidth="6" strokeDasharray="68 26" />
        </>
      ) : name === 'chat' ? (
        <>
          <Panel x={119} y={26} w={87} h={16} />
          <Line x={127} y={32} width={68} />
          <Panel x={50} y={48} w={116} h={29} />
          <Line x={58} y={55} width={97} />
          <Line x={58} y={65} width={67} />
          <Panel x={50} y={87} w={156} h={17} />
          <circle cx="195" cy="95.5" r="5" fill="var(--color-fd-primary)" />
        </>
      ) : name === 'not-found' ? (
        <>
          <text x="128" y="54" textAnchor="middle" fontSize="20" fontWeight="600" fill="var(--color-fd-primary)">404</text>
          <Line x={84} y={65} width={88} />
          <Line x={96} y={74} width={64} />
          <rect x="104" y="86" width="48" height="12" rx="4" fill="var(--color-fd-primary)" />
        </>
      ) : (
        <>
          <Panel x={81} y={22} w={94} h={82} />
          <Line x={94} y={31} width={47} />
          {[57, 73].map((y) => <Panel key={y} x={94} y={y} w={68} h={11} />)}
          <rect x={94} y={89} width={68} height={9} rx="3" fill="var(--color-fd-primary)" />
        </>
      )}
    </svg>
  );
}

export function BlockGallery() {
  return (
    <ul className="not-prose grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
      {blocks.map((block) => (
        <li key={block.name} className="m-0 min-w-0 p-0">
          <Link
            href={blockPath(block.name)}
            className="block h-full overflow-hidden rounded-xl border bg-fd-card text-fd-card-foreground transition-colors hover:border-fd-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary"
          >
            <Thumbnail name={block.name} />
            <div className="grid gap-1 border-t p-4">
              <span className="font-semibold">{block.title}</span>
              <span className="text-sm text-fd-muted-foreground">{block.description}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
