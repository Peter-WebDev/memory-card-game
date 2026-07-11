'use client';
import Image from "next/image";

type CardProps = {
    imageUrl: string;
    isFlipped: boolean;
    isMatched: boolean;
    // Card is only rendered by GameBoard (also a Client Component), so this
    // function prop never crosses a server/client boundary despite the
    // "use client" entry-file lint warning.
    onClick: () => void;
    'data-cy'?: string;
    'data-asset-url'?: string;
};

export default function Card({
    imageUrl,
    isFlipped,
    isMatched,
    onClick,
    'data-cy': dataCy,
    'data-asset-url': dataAssetUrl,
}: CardProps) {
    // Icons (Food & Drink, from Iconify) are SVGs that should be shown whole
    // with padding; photos (Dogs/Cats) should cover the whole card edge to edge.
    // The Iconify URL is like ".../name.svg?width=100", so match .svg anywhere.
    const isIcon = imageUrl.includes('.svg');

    return (
        <div
            data-cy={dataCy}
            data-asset-url={dataAssetUrl}
            data-flipped={isFlipped}
            data-matched={isMatched}
            onClick={!isFlipped ? onClick : undefined}
            className={`
        relative w-18 h-18 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg
        perspective-card transition-transform duration-500 transform-style-3d
        ${isFlipped || isMatched ? 'cursor-default' : 'cursor-pointer'}
        ${isFlipped ? 'rotate-x-180' : ''}
        ${isMatched ? 'opacity-50' : ''}
      `}
        >
            <div
                className={`
          absolute inset-0 rounded-lg
          border-b-4 border-gray-700
          bg-gray-500
          transition-colors duration-200
          flex justify-center items-center
          ${isFlipped ? 'backface-hidden' : 'backface-visible hover:border-gray-900 hover:bg-gray-600'}
        `}
            >
                <div className="text-3xl sm:text-5xl md:text-6xl text-white font-bold select-none">?</div>
            </div>
            <div
                className={`
          absolute inset-0 rounded-lg overflow-hidden bg-white
          border-b-4 border-gray-700
          flex justify-center items-center
          ${isIcon ? 'p-2' : ''}
          rotate-x-180 transition-transform duration-500
          ${isFlipped ? 'backface-visible' : 'backface-hidden'}
        `}
            >
                <Image
                    src={imageUrl}
                    alt=""
                    className={`w-full h-full ${isIcon ? 'object-contain' : 'object-cover'}`}
                    width={100}
                    height={100}
                />
            </div>
        </div>

    );
}