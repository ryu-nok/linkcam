// Testes das constantes geradas: conferem que os valores batem com docs/PROTOCOLO.md.

use linkcam_protocol::*;

#[test]
fn every_message_type_roundtrips() {
    for t in MessageType::ALL {
        assert_eq!(MessageType::from_u8(t.as_u8()), Some(t), "{}", t.name());
    }
}

#[test]
fn unknown_type_is_none() {
    // Tipo desconhecido deve ser ignorado, então não pode virar um tipo válido
    assert_eq!(MessageType::from_u8(0x99), None);
}

#[test]
fn values_match_protocol_doc() {
    assert_eq!(MessageType::Hello.as_u8(), 0x01);
    assert_eq!(MessageType::VideoFrame.as_u8(), 0x41);
    assert_eq!(MessageType::Bye.as_u8(), 0xFF);
    assert_eq!(DEFAULT_PORT, 47100);
    assert_eq!(HEADER_SIZE, 6);
    assert_eq!(MAX_PAYLOAD_BYTES, 8 * 1024 * 1024);
    assert_eq!(flags::KEYFRAME, 1);
}

#[test]
fn latency_labels_follow_table() {
    assert_eq!(latency_label(24), "Excelente");
    assert_eq!(latency_label(50), "Boa");
    assert_eq!(latency_label(119), "Boa");
    assert_eq!(latency_label(120), "Instável");
    assert_eq!(latency_label(250), "Ruim");
    assert_eq!(latency_label(5000), "Ruim");
}
