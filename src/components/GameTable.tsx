export function GameTable() {
    const ws = new WebSocket('ws://localhost:3000/');
    ws.onopen = () => {
      console.log('connected');
      ws.send('Hello Server!');
    }
    return <div>Game Table Component</div>
}