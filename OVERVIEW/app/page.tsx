import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image
        src="https://i.pinimg.com/1200x/f6/c9/0f/f6c90fbf3ad5d8cbfb5c2d8837e0baa7.jpg"
        alt="Hero Image"
        width={500}
        height={500}
        className="rounded-lg prevent-select-drag"
      />
    </div>
  );
}
