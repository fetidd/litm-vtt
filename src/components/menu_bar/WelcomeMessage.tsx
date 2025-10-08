interface WelcomeMessageProps {
  username: string;
}

export default function WelcomeMessage({ username }: WelcomeMessageProps) {
  return <span>Welcome, {username}</span>;
}