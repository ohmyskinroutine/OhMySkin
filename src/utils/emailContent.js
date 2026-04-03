const buildEmailHtml = (routine) => {
  const morningHtml = routine.morning
    .map(
      (p) => `
        <div style="margin-bottom: 12px;">
          <p style="margin: 0; font-weight: 600;">${p.name}</p>
          <p style="margin: 0; font-size: 14px; color: #7a6f6f;">${p.brand || ""}</p>
        </div>
      `,
    )
    .join("");

  const eveningHtml = routine.evening
    .map(
      (p) => `
        <div style="margin-bottom: 12px;">
          <p style="margin: 0; font-weight: 600;">${p.name}</p>
          <p style="margin: 0; font-size: 14px; color: #7a6f6f;">${p.brand || ""}</p>
        </div>
      `,
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; background-color: #f8f5f2; padding: 40px;">
      
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        
        <!-- LOGO -->
        <div style="text-align: center; padding: 24px;">
          <img 
            src="https://res.cloudinary.com/dxehv4yky/image/upload/v1775205815/Capture_d_e%CC%81cran_2026-04-03_a%CC%80_10.43.27_idhpkz.png" 
            alt="Oh My Skin"
            style="width: 120px;"
          />
        </div>

        <!-- IMAGE BANNIÈRE -->
        <img 
          src="https://res.cloudinary.com/dxehv4yky/image/upload/v1775161489/img-mail_cgxicl.jpg"
          alt="Skincare"
          style="width: 100%; height: 200px; object-fit: cover;"
        />

        <div style="padding: 32px;">
          
          <h1 style="margin: 0 0 20px; font-size: 20px; text-align: center; color: #6b5f5f;">
         Pour prendre soin de ta peau :
          </h1>


          <!-- ROUTINE MATIN -->
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 18px; margin-bottom: 12px;">🌞 Routine du matin</h2>
            ${morningHtml || "<p>Aucun produit</p>"}
          </div>

          <!-- ROUTINE SOIR -->
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 18px; margin-bottom: 12px;"> 🌙 Routine du soir</h2>
            ${eveningHtml || "<p>Aucun produit</p>"}
          </div>


          <!-- NOTE -->
          <div style="background-color: #f4ece8; padding: 16px; border-radius: 12px; margin-top: 24px;">
            <p style="margin: 0; font-size: 14px; color: #5c4f4f;">
              💡 Conseil: intègre progressivement les nouveaux produits pour éviter les réactions, un récapitulatif est joint pour t’accompagner au quotidien.
            </p>
          </div>

          <!-- FOOTER -->
          <p style="margin-top: 32px; font-size: 13px; color: #9a8f8f; text-align: center;">
            Oh My Skin — ta routine, simplifiée
          </p>

        </div>
      </div>
    </div>
  `;
};

export default buildEmailHtml;
