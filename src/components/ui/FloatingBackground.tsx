// The signature ambient element used across marketing pages: three soft,
// slowly-drifting gradient orbs behind a glass surface — an "aurora" that
// gives the whole product its visual identity without being distracting.
export function FloatingBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-aura-radial dark:opacity-100 opacity-40" />
      <div className="absolute top-[-10%] left-[-5%] w-[38rem] h-[38rem] rounded-full bg-aura-indigo/30 blur-[110px] animate-float-slow" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[32rem] h-[32rem] rounded-full bg-aura-cyan/25 blur-[110px] animate-float" />
      <div className="absolute top-[35%] right-[15%] w-[24rem] h-[24rem] rounded-full bg-aura-pink/20 blur-[100px] animate-float-delay" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)] dark:block hidden" />
    </div>
  );
}
