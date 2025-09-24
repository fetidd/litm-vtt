import constants, { CARD_STYLE } from '@/constants';
import { Hero as LitmHero } from '../../litm/hero';
import { useState } from 'react';
import { Theme } from '@/litm/theme';

export default function HeroCard({
    hero,
}: HeroCardProps) {

    const [side, setSide] = useState<"front" | "back">("front");

    return (
        <div style={CARD_STYLE}>
            {side == "front" && <>
                {/* Hero name */}
                <div style={{ fontSize: "2rem", textAlign: "center" }}>{hero.name}</div>

                {/* Player name */}
                <h3 style={{ margin: "1px", backgroundColor: "rgba(204, 165, 126, 0.43)", textAlign: "center" }}>Player Name</h3>
                <div style={{ textAlign: "center" }}>{hero.owner}</div>

                {/* Relationship tags */}
                <h3 style={{ margin: "1px", backgroundColor: "rgba(204, 165, 126, 0.43)", textAlign: "center" }}>Fellowship Relationship</h3>
                <div style={{ display: "flex", justifyContent: "space-around", flexDirection: "column", gap: "2px" }} >
                    {[...Array(4).keys()].map(n => {
                        return (
                            <div key={n} style={{ display: "flex", justifyContent: "space-around" }}>
                                <div style={{ display: "flex" }}>
                                    <span>Character name</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <div
                                        className="placeholder-relationship-tag"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            background: "transparent",
                                            border: "1px solid #9b5424ff",
                                            borderRadius: "4px",
                                            minWidth: "80px",
                                            height: "30px",
                                            alignContent: "center",
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Promise */}
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <h3>Promise</h3>
                    {[...Array(hero.maxPromise).keys()].map(n => {
                        return (
                            <input key={n} type="checkbox" onChange={() => {}} checked={n < hero.promise}/>
                        )
                    })}
                </div>

                {/* Quintessences */}
                <h3 style={{ margin: "1px", backgroundColor: "rgba(204, 165, 126, 0.43)", textAlign: "center" }}>Quintessences</h3>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {[...Array(4).keys()].map(n => {
                        return (
                            <span key={n} style={{ padding: "4px" }}>{`Quintessence ${n}`}</span>
                        )
                    })}
                </div>
            </>}
            {side == "back" && <>
                {/* Backpack */}
                <h3>Backpack</h3>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {[...Array(4).keys()].map(n => {
                        return (
                            <span>{`Backpack item ${n}`}</span>
                        )
                    })}
                </div>

                {/* Notes */}
                <h3>Notes</h3>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {[...Array(4).keys()].map(n => {
                        return (
                            <span>{`Note ${n}`}</span>
                        )
                    })}
                </div>
            </>}
            <span onClick={() => setSide(side == "front" ? "back" : "front")}>flip</span>
        </div>
    )
}

interface HeroCardProps {
    hero: LitmHero,
}


