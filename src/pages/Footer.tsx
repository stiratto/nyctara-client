const Footer = () => {
  return (
    <div className="bg-[#212121] flex flex-col md:flex-row">
      <div className="container flex flex-col-reverse h-full lg:flex-row justify-between items-center text-[#ecefdc] ">
        <div>
          <h2 className="text-4xl max-w-xl ">
            Encuentra tu fragancia perfecta entre nuestra colección única. Tu historia olfativa comienza aquí.
          </h2>
          <img
            src="https://nyctara-perfumery-static.s3.us-east-1.amazonaws.com/nyctara%2Blight.webp"
            alt="Lumiere Texto"
            className="max-w-[10rem]"
          />
          <p className="font-display">2024 © Nyctara Perfumes</p>
          <div className="my-8">
            <h3 className="text-xl">Contacto</h3>
            <div className="flex gap-4 ">
              <a
                href="https://www.instagram.com/nyctaraperfumes/"
                target="_blank"
                className="border-b"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61560099280836"
                target="_blank"
                className="border-b"
              >
                Facebook
              </a>
              <a
                href="https://wa.link/olrl2e"
                target="_blank"
                className="border-b"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <img
          src="https://nyctara-perfumery-static.s3.us-east-1.amazonaws.com/ng%2Bfooter%2Btransaprente.webp"
          alt=""
          className=""
        />
      </div>
    </div>
  );
};

export default Footer;
