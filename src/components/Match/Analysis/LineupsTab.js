'use client';
import { useState } from 'react';
import { FaArrowRight, FaPlus, FaTshirt, FaUserInjured, FaExchangeAlt } from 'react-icons/fa';
import styles from './Tabs/LineupsTab.module.css';

// DADOS MOCKADOS (Baseados na imagem: Mirassol vs Flamengo)
const mockLineups = {
    home: {
        id: 1,
        name: 'Mirassol',
        formation: '4-3-3',
        color: '#00ff88', // Cor da camisa (Verde)
        starters: [
            { id: 1, name: 'Muralha', number: 23, pos: 'GK', rating: '6.72', grid: '1:1' },
            { id: 2, name: 'Lucas Ramon', number: 19, pos: 'DF', rating: '6.71', grid: '2:1' },
            { id: 3, name: 'João Victor', number: 34, pos: 'DF', rating: '6.12', grid: '2:2' },
            { id: 4, name: 'Luiz Otávio', number: 4, pos: 'DF', rating: '6.47', grid: '2:3' },
            { id: 5, name: 'Guilherme', number: 16, pos: 'DF', rating: '6.82', grid: '2:4' },
            { id: 6, name: 'Danielzinho', number: 8, pos: 'MF', rating: '6.55', grid: '3:1' },
            { id: 7, name: 'Neto Moura', number: 25, pos: 'MF', rating: '6.67', grid: '3:2' },
            { id: 8, name: 'Gabriel', number: 10, pos: 'MF', rating: '6.98', grid: '3:3' },
            { id: 9, name: 'Negueba', number: 11, pos: 'FW', rating: '6.75', grid: '4:1' },
            { id: 10, name: 'Fernandinho', number: 77, pos: 'FW', rating: '6.50', grid: '4:2' },
            { id: 11, name: 'Dellatorre', number: 49, pos: 'FW', rating: '7.10', grid: '4:3' },
        ],
        subs: [
            { id: 12, name: 'Luiz Otávio', number: 4, time: '46\'', in: 'Jemmes', rating: '6.45' },
            { id: 13, name: 'Roni', number: 5, time: '', in: '', rating: '' },
            { id: 14, name: 'Shaylon', number: 7, time: '', in: '', rating: '' },
            { id: 15, name: 'Guilherme', number: 12, time: '63\'', in: 'Chico Kim', rating: '6.69' },
            { id: 16, name: 'Cristian Renato', number: 17, time: '58\'', in: 'Renato Marques', rating: '7.02' },
            { id: 17, name: 'Daniel Borges', number: 20, time: '', in: '', rating: '' },
            { id: 18, name: 'José Aldo', number: 21, time: '77\'', in: 'Danielzinho', rating: '6.72' },
            { id: 19, name: 'Alex Muralha', number: 23, time: '', in: '', rating: '' },
            { id: 20, name: 'Ramires', number: 40, time: '', in: '', rating: '' },
            { id: 21, name: 'Yago Felipe', number: 41, time: '', in: '', rating: '' },
            { id: 22, name: 'Thomazella', number: 90, time: '', in: '', rating: '' },
            { id: 23, name: 'Carlos Eduardo', number: 96, time: '58\'', in: 'Alesson', rating: '6.80' },
        ],
        missing: [
            { id: 99, name: 'M. de Sales Cabral', reason: 'Lesão' }
        ],
        insights: [
            { text: "Onze com muitos jogadores alternativos.", type: "warning" }
        ]
    },
    away: {
        id: 2,
        name: 'Flamengo',
        formation: '4-2-3-1',
        color: '#ffffff', // Cor da camisa (Branco/Vermelho na img)
        starters: [
            { id: 1, name: 'Rossi', number: 1, pos: 'GK', rating: '6.93', grid: '1:1' },
            { id: 2, name: 'Varela', number: 2, pos: 'DF', rating: '6.28', grid: '2:1' },
            { id: 3, name: 'F. Bruno', number: 15, pos: 'DF', rating: '6.29', grid: '2:2' },
            { id: 4, name: 'L. Pereira', number: 4, pos: 'DF', rating: '7.26', grid: '2:3' },
            { id: 5, name: 'Ayrton Lucas', number: 6, pos: 'DF', rating: '6.70', grid: '2:4' },
            { id: 6, name: 'Pulgar', number: 5, pos: 'MF', rating: '6.58', grid: '3:1' },
            { id: 7, name: 'Allan', number: 29, pos: 'MF', rating: '6.59', grid: '3:2' },
            { id: 8, name: 'Gerson', number: 8, pos: 'MF', rating: '7.45', grid: '4:1' }, // Everton Ribeiro na img antiga?
            { id: 9, name: 'Arrascaeta', number: 14, pos: 'MF', rating: '6.12', grid: '4:2' },
            { id: 10, name: 'Cebolinha', number: 11, pos: 'MF', rating: '6.67', grid: '4:3' },
            { id: 11, name: 'Pedro', number: 9, pos: 'FW', rating: '6.82', grid: '5:1' },
        ],
        subs: [
            { id: 58, name: 'Lopes', number: 58, time: '', in: '', rating: '' },
            { id: 66, name: 'Bruno Xavier', number: 66, time: '', in: '', rating: '' },
            { id: 72, name: 'Santos', number: 72, time: '', in: '', rating: '' },
            { id: 76, name: 'Vaz', number: 76, time: '', in: '', rating: '' },
            { id: 78, name: 'Fachineti', number: 78, time: '', in: '', rating: '' },
            { id: 79, name: 'Joshua', number: 79, time: '63\'', in: 'Guilherme Gomes', rating: '6.34' },
            { id: 80, name: 'Camargo', number: 80, time: '', in: '', rating: '' },
            { id: 83, name: 'Veloso', number: 83, time: '', in: '', rating: '' },
            { id: 84, name: 'Werneck', number: 84, time: '', in: '', rating: '' },
        ],
        missing: [
            { id: 101, name: 'E. Pulgar Farfán', reason: 'Suspenso' },
            { id: 102, name: 'A. Rodrigues de Souza', reason: 'Lesão' }
        ],
        insights: [
            { text: "Onze com muitos jogadores alternativos.", type: "warning" },
            { text: "Onze com menos rating (50) do que o onze ideal.", type: "warning" },
            { text: "A equipa tem ausências importantes.", type: "danger" }
        ]
    }
};

export default function LineupsTab({ match }) {
    // Use real data if available, otherwise fallback to mock
    const lineups = (match?.lineups && match.lineups.home && match.lineups.away)
        ? match.lineups
        : mockLineups;

    // Helper para cor da nota
    const getRatingColor = (rating) => {
        const r = parseFloat(rating);
        if (!r) return styles.ratingGray;
        if (r >= 7.0) return styles.ratingGreen;
        if (r < 6.5) return styles.ratingRed;
        return styles.ratingOrange;
    };

    // Componente Player no Campo
    const PitchPlayer = ({ player, isHome }) => (
        <div className={styles.pitchPlayer}>
            <div className={styles.playerAvatarContainer}>
                <img
                    src={player.image || `https://cdn.sportmonks.com/images/soccer/players/1/${player.id}.png`}
                    alt={player.name}
                    className={styles.playerAvatar}
                    onError={(e) => e.target.src = "https://cdn.sportmonks.com/images/soccer/placeholder.png"}
                />
                <span className={`${styles.ratingBadge} ${getRatingColor(player.rating)}`}>
                    {player.rating}
                </span>
            </div>
            <div className={styles.playerInfo}>
                <span className={styles.playerNumber}>{player.number}</span>
                <span className={styles.playerName}>{player.name.split(' ')[0]}</span>
            </div>
        </div>
    );

    // Componente Linha de Substituição
    const SubRow = ({ player }) => (
        <div className={styles.subRow}>
            <div className={styles.subLeft}>
                <div className={styles.avatarSmall}>
                    <img
                        src={player.image || `https://cdn.sportmonks.com/images/soccer/players/1/${player.id}.png`}
                        onError={(e) => e.target.src = "https://cdn.sportmonks.com/images/soccer/placeholder.png"}
                    />
                </div>
                <div className={styles.subInfo}>
                    <div className={styles.subNameRow}>
                        <span className={styles.subNumber}>{player.number} • </span>
                        <span className={styles.subName}>{player.name}</span>
                    </div>
                    {player.in && (
                        <div className={styles.subAction}>
                            <FaExchangeAlt className={styles.iconSwap} />
                            <span>{player.in} {player.time && `(${player.time})`}</span>
                        </div>
                    )}
                </div>
            </div>
            {player.rating && (
                <div className={`${styles.subRating} ${getRatingColor(player.rating)}`}>
                    {player.rating}
                </div>
            )}
        </div>
    );

    // Componente Linha de Ausência
    const MissingRow = ({ player }) => (
        <div className={styles.missingRow}>
            <div className={styles.avatarSmallGray}>
                <FaUserInjured />
            </div>
            <span className={styles.missingName}>{player.name}</span>
            <FaPlus className={styles.iconPlus} />
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Header: Times e Avisos */}
            <div className={styles.header}>
                <div className={styles.teamHeaderLeft}>
                    <div className={styles.teamTitle}>
                        <div className={styles.colorDot} style={{ backgroundColor: lineups.home.color }}></div>
                        <span>{lineups.home.name}</span>
                    </div>
                    {lineups.home.insights?.map((insight, i) => (
                        <div key={i} className={styles.insight}>
                            ⚠️ {insight.text}
                        </div>
                    ))}
                </div>
                <div className={styles.teamHeaderRight}>
                    <div className={styles.teamTitle}>
                        <span>{lineups.away.name}</span>
                        <div className={styles.colorDot} style={{ backgroundColor: '#e63946' }}></div>
                        {/* Usei vermelho para destacar, na imagem é o escudo */}
                    </div>
                    {lineups.away.insights?.map((insight, i) => (
                        <div key={i} className={styles.insight}>
                            ⚠️ {insight.text}
                        </div>
                    ))}
                </div>
            </div>

            {/* O CAMPO DE FUTEBOL */}
            <div className={styles.pitchWrapper}>
                <div className={styles.pitch}>
                    {/* Linhas do Campo */}
                    <div className={styles.lineHalf}></div>
                    <div className={styles.lineCircle}></div>
                    <div className={styles.lineBoxLeft}></div>
                    <div className={styles.lineBoxRight}></div>
                    <div className={styles.cornerTopLeft}></div>
                    <div className={styles.cornerTopRight}></div>
                    <div className={styles.cornerBottomLeft}></div>
                    <div className={styles.cornerBottomRight}></div>

                    {/* Jogadores Casa (Esquerda) */}
                    <div className={styles.teamFormationLeft}>
                        {/* Goleiro */}
                        <div className={styles.colGK}>
                            {lineups.home.starters?.filter(p => p.pos === 'GK').map(p => <PitchPlayer key={p.id} player={p} />)}
                        </div>
                        {/* Defesa */}
                        <div className={styles.colLine}>
                            {lineups.home.starters?.filter(p => p.pos === 'DF').map(p => <PitchPlayer key={p.id} player={p} />)}
                        </div>
                        {/* Meio */}
                        <div className={styles.colLine}>
                            {lineups.home.starters?.filter(p => p.pos === 'MF').map(p => <PitchPlayer key={p.id} player={p} />)}
                        </div>
                        {/* Ataque */}
                        <div className={styles.colLine}>
                            {lineups.home.starters?.filter(p => p.pos === 'FW').map(p => <PitchPlayer key={p.id} player={p} />)}
                        </div>
                    </div>

                    {/* Jogadores Fora (Direita) */}
                    <div className={styles.teamFormationRight}>
                        {/* Ataque (Invertido) */}
                        <div className={styles.colLine}>
                            {lineups.away.starters?.filter(p => p.pos === 'FW').map(p => <PitchPlayer key={p.id} player={p} />)}
                        </div>
                        {/* Meio */}
                        <div className={styles.colLine}>
                            {lineups.away.starters?.filter(p => p.pos === 'MF').map(p => <PitchPlayer key={p.id} player={p} />)}
                        </div>
                        {/* Defesa */}
                        <div className={styles.colLine}>
                            {lineups.away.starters?.filter(p => p.pos === 'DF').map(p => <PitchPlayer key={p.id} player={p} />)}
                        </div>
                        {/* Goleiro */}
                        <div className={styles.colGK}>
                            {lineups.away.starters?.filter(p => p.pos === 'GK').map(p => <PitchPlayer key={p.id} player={p} />)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Listas Inferiores */}
            <div className={styles.listsContainer}>

                {/* Substituições */}
                <div className={styles.listSection}>
                    <h4 className={styles.listTitle}>Substituições</h4>
                    <div className={styles.listGrid}>
                        {/* Casa */}
                        <div className={styles.listCol}>
                            {lineups.home.subs?.map(p => <SubRow key={p.id} player={p} />)}
                        </div>
                        {/* Fora */}
                        <div className={styles.listCol}>
                            {lineups.away.subs?.map(p => <SubRow key={p.id} player={p} />)}
                        </div>
                    </div>
                </div>

                {/* Ausências */}
                <div className={styles.listSection}>
                    <h4 className={styles.listTitle}>Ausências</h4>
                    <div className={styles.listGrid}>
                        {/* Casa */}
                        <div className={styles.listCol}>
                            {lineups.home.missing?.map(p => <MissingRow key={p.id} player={p} />)}
                        </div>
                        {/* Fora */}
                        <div className={styles.listCol}>
                            {lineups.away.missing?.map(p => <MissingRow key={p.id} player={p} />)}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}