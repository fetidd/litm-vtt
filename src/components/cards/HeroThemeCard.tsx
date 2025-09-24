import constants, { CARD_STYLE } from '@/constants';
import { HeroTheme as LitmTheme } from '../../litm/theme';
import React, { useState } from 'react';
import Tag from '../Tag';
import type { Entity } from '@/litm/entity';
import { Tag as LitmTag } from "../../litm/tag"

export default function HeroThemeCard({
    theme,
    editing,
    setEditing,
    updateEntity,
    removeEntity,
    addModifier
}: HeroThemeCardProps) {

    const [side, setSide] = useState<"front" | "back">("front");

    const mightColor = constants.MIGHT_COLORS[theme.might]

    const themeAsTag = LitmTag.deserialize(theme)

    return (
        <div style={{ ...CARD_STYLE, margin: "4px" }}>
            {/* Might and theme type */}
            <div style={{
                display: "flex",
                height: "40px",
                background: mightColor,
                color: "white",
                justifyContent: "space-around",
                alignItems: "center"
            }}>
                <span style={{ fontSize: "1.2rem" }}>{theme.type!.toUpperCase()}</span>
            </div>
            {side == "front" && <>
                {/* Power Tags (first being larger)*/}
                <Tag
                    tag={themeAsTag}
                    editing={false}
                    setEditing={setEditing}
                    updateEntity={updateEntity}
                    isTheme={true}
                    removeEntity={undefined}
                    addModifier={addModifier} />
                {theme.otherTags.map(tag => {
                    return (
                        <Tag
                            key={tag.id}
                            tag={tag}
                            editing={false}
                            setEditing={setEditing}
                            updateEntity={updateEntity}
                            removeEntity={undefined}
                            addModifier={addModifier} />
                    )
                })}
                {/* Weakness tags */}
                {theme.weaknessTags.map(tag => {
                    return (
                        <Tag
                            key={tag.id}
                            tag={tag}
                            editing={false}
                            setEditing={setEditing}
                            updateEntity={updateEntity}
                            isWeakness={true}
                            removeEntity={undefined}
                            addModifier={addModifier} />
                    )
                })}
                {/* Quest */}
                <div>{theme.quest}</div>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    {/* Abandon, improve, milestone */}
                    {["abandon", "improve", "milestone"].map(stat => {
                        return (
                            <div key={stat} style={{ display: "flex", flexDirection: "column", alignItems: "center`" }}>
                                <span>{stat.toUpperCase()}</span>
                                <div>
                                    {[...Array(theme.maxAdvancement).keys()].map(n => {
                                        return (
                                            <input key={n} type="checkbox" onChange={() => {}} checked={n < (theme as any)[stat]} />
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </>}
            {side == "back" && <>
                {/* Special improvements */}
            </>}
            <span onClick={() => setSide(side == "front" ? "back" : "front")}>flip</span>
        </div>
    )
}

interface HeroThemeCardProps {
    theme: LitmTheme,
    editing: string | undefined,
    setEditing: any,
    updateEntity: any,
    removeEntity: any,
    addModifier: any,
}


