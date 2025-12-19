DELIMITER $$

CREATE PROCEDURE zloz_rezerwacje(
    IN p_sala_id INT,
    IN p_siedzenie_id INT,
    IN p_seans_id INT,
    IN p_klient VARCHAR(255),
    IN p_status VARCHAR(255),
    IN p_uzytkownik_id INT
)
BEGIN
  DECLARE v_existing_id INT;

  -- sprawdzenie czy miejsce już zajęte
SELECT id
INTO v_existing_id
FROM rezerwacja
WHERE sala_id = p_sala_id
  AND siedzenie_id = p_siedzenie_id
  AND seans_id = p_seans_id
  AND status = 'POTWIERDZONA'
    LIMIT 1;

IF v_existing_id IS NOT NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Miejsce jest już zajęte';
ELSE
    INSERT INTO rezerwacja (
      sala_id,
      siedzenie_id,
      seans_id,
      klient,
      status,
      uzytkownik_id,
      data_utworzenia
    ) VALUES (
      p_sala_id,
      p_siedzenie_id,
      p_seans_id,
      p_klient,
      p_status,
      p_uzytkownik_id,
      NOW()
    );
END IF;

END$$

DELIMITER ;
