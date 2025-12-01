import type { Route } from './+types/well-known';

export const loader = () => {
  return new Response(null, { status: 204 });
};

export default function WellKnown({}: Route.ComponentProps) {
  return null;
}
