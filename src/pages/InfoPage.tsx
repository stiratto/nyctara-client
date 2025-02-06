const InfoPage = () => {
  return (
    <div className=" md:container flex flex-col md:flex-row justify-center my-28 px-24">
      <div className="container">
        <div>
          <h1 className="text-7xl mb-8 flex items-center justify-center lg:justify-start">
            Sobre Nosotros
          </h1>
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-xl max-w-2xl">
              <p>
                En Nyctara Perfumery, nuestro amor por los perfumes va más allá de las palabras. Nos esforzamos por
                ofrecer una experiencia de compra excepcional, donde cada aroma cuenta una historia única.
                <br />
                <br />{" "}
                Desde las fragancias clásicas hasta las últimas tendencias, nuestra colección está cuidadosamente
                seleccionada para satisfacer incluso los gustos más exigentes. Únete a nosotros y déjanos ayudarte a
                encontrar tu perfume perfecto. Algunos de los perfumes de nuestra colección son perfumes totalmente
                originales, provenientes de La Riviera (marca Colombiana).
              </p>
              <div className="my-8">
                <h2 className="text-4xl font-bold">Gastos de envío</h2>
                <p>
                  Los gastos de envío se calculan al finalizar la compra; si adquieres más de 2 perfumes el envío te
                  sale completamente gratuito..
                </p>
              </div>
              <div className="my-8">
                <h2 className="text-4xl font-bold">Tiempos de entrega</h2>
                <p>
                  Los tiempos de entrega dependen de si estás ubicado en una ciudad principal, puede demorar dentro de 2
                  a 3 días hábiles. La guía de envío se despachará máximo 24hrs después de realizar el pago.
                </p>
              </div>
              <div className="my-8">
                <h2 className="text-4xl font-bold">Reembolsos</h2>
                <p>
                  Los reembolsos solo se consideran para artículos que no se hayan utilizado ni hayan sido alterados.
                  Lumière Perfumery se reserva el derecho de rechazar un reembolso por cualquier artículo que no
                  consideremos no utilizado.
                </p>
              </div>
              <div className="my-8">
                <h2 className="text-4xl font-bold">Devoluciones</h2>
                <p>
                  Para ser considerado para un proceso de devolución, envíenos un correo electrónico a{" "}
                  <span className="font-bold">nyctaraperfumes@gmail.com</span> o al{" "}
                  <a
                    href="https://wa.link/olrl2e"
                    target="_blank"
                    className="font-bold"
                  >
                    WhatsApp
                  </a>
                  . El cliente es responsable de todos los gastos de envío de los productos devueltos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src="https://i.pinimg.com/564x/9a/ac/ad/9aacad9873e0b5618360a5fdc7ec1726.jpg"
        className="rounded-xl max-w-sm object-cover "
        alt=""
      />
    </div>
  );
};

export default InfoPage;
