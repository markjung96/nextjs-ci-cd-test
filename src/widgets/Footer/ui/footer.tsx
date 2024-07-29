type Props = {};
export function Footer(props: Props) {
  return (
    <footer className="w-full py-4 text-center text-gray-500">
      <p>
        Blockscan © 2024 (A1) | Made with <span className="text-red-500">❤️</span> by the team behind{" "}
        <a href="#" className="text-blue-500">
          Etherscan
        </a>
      </p>
      <div className="mt-2 space-x-4">
        <a href="#" className="text-gray-400">
          Terms
        </a>
        <a href="#" className="text-gray-400">
          Policy
        </a>
        <a href="#" className="text-gray-400">
          Donations
        </a>
      </div>
    </footer>
  );
}
